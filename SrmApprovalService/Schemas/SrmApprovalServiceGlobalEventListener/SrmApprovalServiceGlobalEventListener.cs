using BPMSoft.Common;
using BPMSoft.Core.DB;
using BPMSoft.Core.Entities;
using BPMSoft.Core.Entities.Events;
using BPMSoft.Core.Factories;
using BPMSoft.Core.Process;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BPMSoft.Configuration.Srm
{
    [EntityEventListener(IsGlobal = true)]
    public class SrmApprovalServiceGlobalEventListener : SrmBaseEntityEventListener<SrmApprovalServiceGlobalEventHandler>
    {
        // Тут должно быть пусто.
    }

    public class SrmApprovalServiceGlobalEventHandler : SrmBaseEntityEventHandler
    {
        /// <summary>
        /// Переопределение базового метода обработчика события до изменения записи.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public override void OnUpdating(object sender, EntityBeforeEventArgs e)
        {
            InitParameters(sender);
            base.OnUpdating(sender, e);
            StartApproval();
        }

        /// <summary>
        /// Запускает процесс согласования.
        /// </summary>
        protected virtual void StartApproval()
        {
            try
            {
                if (TryGetArtifactVarietiesByApprovalObjectSchemaUId(out var artifactVarieties))
                {
                    foreach (var artifactVariety in artifactVarieties)
                    {
                        if (IsArtifactGenerationConditionsSuitable(artifactVariety))
                        {
                            var helper = ClassFactory.Get<SrmApprovalServiceHelper>(new ConstructorArgument("userConnection", UserConnection));
                            var connectionColumn = helper.GetObjectsConnectionColumn(nameof(SrmArtifact), Entity.Schema.Name);
                            var version = GetArifactVersionByVarietyId(artifactVariety.PrimaryColumnValue, connectionColumn, Entity.PrimaryColumnValue);
                            StartArtifactCreateProcess(artifactVariety.PrimaryColumnValue, connectionColumn.UId, version);
                            break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.InnerException.ToString());
                throw new Exception(ex.Message, ex);
            }
        }

		/// <summary>
        /// Запускает процесс "INS02.2 Создание Артефакта".
        /// </summary>
        /// <param name="artifactVarietyId">Идентификатор вида артефакта.</param>
		/// <param name="connectionColumnUId">Идентификатор связующей колонки.</param>
		/// <param name="version">Версия артефакта.</param>
        protected virtual void StartArtifactCreateProcess(Guid artifactVarietyId, Guid connectionColumnUId, int version)
        {
            var processExecutor = UserConnection.ProcessEngine.ProcessExecutor;
            var parameters = new Dictionary<string, string>();
            parameters["SrmArtifactVariety"] = artifactVarietyId.ToString();
            parameters["SrmRecordId"] = Entity.PrimaryColumnValue.ToString();
            parameters["SrmConnectionColumnUId"] = connectionColumnUId.ToString();
            parameters["SrmVersion"] = version.ToString();
            var result = processExecutor.Execute("SrmCreateArtifactProcess", parameters);

            if (result.ProcessStatus == ProcessStatus.Error)
            {
				var message = UserConnection.GetLocalizableString(nameof(SrmApprovalServiceGlobalEventListener), "SrmCreateArtifactProcessError");
                throw new Exception(message);
            }
        }

        /// <summary>
        /// Возвращает новую версию артефакта по идентификатору вида артефакта.
        /// </summary>
        /// <param name="varietyId">Идентификатор артефакта.</param>
        /// <param name="connectionColumn">Связующая колонка.</param>
        /// <param name="recordId">Идентификатор записи объекта согласования.</param>
        /// <returns>Новая версия артефакта.</returns>
        protected virtual int GetArifactVersionByVarietyId(Guid varietyId, EntitySchemaColumn connectionColumn, Guid recordId)
        {
            var select = new Select(UserConnection)
                .Column(Func.Max(nameof(SrmArtifact.SrmVersion)))
                .From(nameof(SrmArtifact))
                .Where(nameof(SrmArtifact.SrmArtifactVarietyId))
                .IsEqual(Column.Parameter(varietyId))
                .And(connectionColumn.ColumnValueName)
                .IsEqual(Column.Parameter(recordId)) as Select;

            return select.ExecuteScalar<int>() + 1;
        }

        /// <summary>
        /// Проверяет, удовлетворяют ли значения поля объекта согласования условиям генерации артефакта.
        /// </summary>
        /// <param name="artifactVariety">Вид артефакта.</param>
        /// <returns>true, если удовлетворяют, иначе false.</returns>
        protected virtual bool IsArtifactGenerationConditionsSuitable(Entity artifactVariety)
        {
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, nameof(SrmArtifactGenerationConditions));
            esq.PrimaryQueryColumn.IsAlwaysSelect = true;
            esq.UseAdminRights = true;
            esq.AddColumn(nameof(SrmArtifactGenerationConditions.SrmOriginalValue));
            esq.AddColumn(nameof(SrmArtifactGenerationConditions.SrmTargetValue));
            esq.AddColumn("SrmField.SrmColumnUId").Name = "SrmFieldColumnUId";

            esq.Filters.Add(
                esq.CreateFilterWithParameters(
                    FilterComparisonType.Equal,
                    nameof(SrmArtifactGenerationConditions.SrmArtifactVariety),
                    artifactVariety.PrimaryColumnValue));

            var artifactGenerationConditions = esq.GetEntityCollection(UserConnection);

            if (artifactGenerationConditions.IsEmpty())
            {
                return false;
            }

            foreach (var artifactGenerationCondition in artifactGenerationConditions)
            {
                var columnUId = artifactGenerationCondition.GetTypedColumnValue<Guid>("SrmFieldColumnUId");
                var originValue = artifactGenerationCondition.GetTypedColumnValue<Guid>(nameof(SrmArtifactGenerationConditions.SrmOriginalValue));
                var targetValue = artifactGenerationCondition.GetTypedColumnValue<Guid>(nameof(SrmArtifactGenerationConditions.SrmTargetValue));
                var schema = UserConnection.EntitySchemaManager.GetInstanceByUId(Entity.Schema.UId);
                var column = schema.Columns.GetByUId(columnUId);
                var oldValue = Entity.GetTypedOldColumnValue<Guid>(column.ColumnValueName);
                var newValue = Entity.GetTypedColumnValue<Guid>(column.ColumnValueName);

                if (!originValue.Equals(oldValue) || !targetValue.Equals(newValue))
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Получает данные видов артефакта объекта согласования.
        /// </summary>
        /// <param name="artifactVarieties">Виды артефакта.</param>
        /// <returns>true, если данные получены, иначе false.</returns>
        protected virtual bool TryGetArtifactVarietiesByApprovalObjectSchemaUId(out EntityCollection artifactVarieties)
        {
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, nameof(SrmArtifactVariety));
            esq.PrimaryQueryColumn.IsAlwaysSelect = true;
            esq.UseAdminRights = true;
            esq.AddColumn(nameof(SrmArtifactVariety.CreatedOn)).OrderByDesc();

            esq.Filters.Add(
                esq.CreateFilterWithParameters(
                    FilterComparisonType.Equal,
                    "SrmObject.SrmSchemaUId",
                    Entity.Schema.UId));

            artifactVarieties = esq.GetEntityCollection(UserConnection);
            return artifactVarieties.IsNotEmpty();
        }
    }
}