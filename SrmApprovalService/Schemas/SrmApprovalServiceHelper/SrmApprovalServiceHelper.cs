using BPMSoft.Core;
using BPMSoft.Core.DB;
using BPMSoft.Core.Entities;
using System;
using System.Linq;
using System.Text;

namespace BPMSoft.Configuration.Srm
{
    /// <summary>
    /// Хелпер сервиса согласования.
    /// </summary>
    public class SrmApprovalServiceHelper
    {
        private UserConnection _userConnection { get; set; }
        private string _tableStyles = "border:solid 1px black;border-collapse:collapse;text-align:left;";
        private string _rowStyles = "padding:2px 5px 2px 5px;border:solid 1px black;";

        /// <summary>
        /// Конструктор.
        /// </summary>
        /// <param name="userConnection">Соединение с BPMSoft.</param>
        public SrmApprovalServiceHelper(UserConnection userConnection)
        {
            _userConnection = userConnection;
        }

        /// <summary>
        /// Генерирует содержание артефакта по заданным параметрам вида артефакта.
        /// </summary>
        /// <param name="approvalObjectId">Идентификатор объекта согласования.</param>
        /// <param name="recordId">Идентификатор записи объекта согласования.</param>
        /// <param name="varietyContent">Содержание вида артефакта.</param>
        /// <returns>Содержание артефакта по заданным параметрам вида артефакта.</returns>
        public virtual string GenerateContent(Guid approvalObjectId, Guid recordId, string varietyContent)
		{
            var approvalObject = GetApprovalObjectRecord(approvalObjectId, recordId);
            var fields = varietyContent.Split(';');
            var content = new StringBuilder();

            content.Append($"<table style=\"{_tableStyles}\">");

            foreach (var field in fields)
            {
                content.Append($"<tr><th style=\"{_rowStyles}\">{field}</th>");

                var column = approvalObject.Schema.Columns
                    .Where(c => c.Caption.Value.Equals(field))
                    .FirstOrDefault();

                if (column is null)
                {
					var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "EntityColumnNotFoundError");
                    throw new Exception(string.Format(errorMessage, field, approvalObject.Schema.Caption));
                }

                var value = approvalObject.GetColumnDisplayValue(column);
                content.Append($"<td style=\"{_rowStyles}\">{value}</td></tr>");
            }

            content.Append("</table>");

			return content.ToString();
		}

        /// <summary>
        /// Возвращает данные записи объекта согласования.
        /// </summary>
        /// <param name="approvalObjectId">Идентификатор объекта согласования.</param>
        /// <param name="recordId">Идентификатор записи.</param>
        /// <returns>Данные записи объекта согласования.</returns>
        protected virtual Entity GetApprovalObjectRecord(Guid approvalObjectId, Guid recordId)
        {
            var schemaUId = GetApprovalObjectSchemaUId(approvalObjectId);
            var schema = _userConnection.EntitySchemaManager.GetInstanceByUId(schemaUId);
            var approvalObject = schema.CreateEntity(_userConnection);

            if (!approvalObject.FetchFromDB(recordId))
            {
				var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "GetApprovalObjectRecordError");
                throw new Exception(string.Format(errorMessage, schema.Caption, recordId));
            }

            return approvalObject;
        }

        /// <summary>
        /// Возвращает идентификатор колонки объекта согласования.
        /// </summary>
        /// <param name="approvalObjectColumnId">Идентификатор записи объекта <see cref="SrmApprovalObjectColumn"/></param>
        /// <returns>Идентификатор колонки объекта согласования.</returns>
        public virtual Guid GetApprovalObjectColumnUId(Guid approvalObjectColumnId)
		{
			var select = new Select(_userConnection)
				.Column(nameof(SrmApprovalObjectColumn.SrmColumnUId))
				.From(nameof(SrmApprovalObjectColumn))
				.Where(nameof(SrmApprovalObjectColumn.Id))
				.IsEqual(Column.Parameter(approvalObjectColumnId)) as Select;

			var objectColumnUId = select.ExecuteScalar<Guid>();
			
			if (Guid.Empty.Equals(objectColumnUId))
            {
                var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "ColumnUIdNotFoundError");
				throw new Exception(errorMessage);
			}
			
			return objectColumnUId;
		}

        /// <summary>
        /// Возвращает идентификатор схемы объекта согласования.
        /// </summary>
        /// <param name="objectId">Идентификатор объекта согласования.</param>
        /// <returns>Идентификатор схемы объекта согласования.</returns>
        public virtual Guid GetApprovalObjectSchemaUId(Guid objectId)
        {
            var select = new Select(_userConnection)
                .Column(nameof(SrmApprovalObject.SrmSchemaUId))
                .From(nameof(SrmApprovalObject))
                .Where(nameof(SrmApprovalObject.Id))
                .IsEqual(Column.Parameter(objectId)) as Select;
			
			var schemaUId = select.ExecuteScalar<Guid>();
			
			if (Guid.Empty.Equals(schemaUId))
            {
                var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "GetApprovalObjectSchemaUIdError");
				throw new Exception(errorMessage);
			}

            return schemaUId;
        }

        /// <summary>
        /// Возвращает данные файлов объекта согласования.
        /// </summary>
        /// <param name="objectId">Идентификатор объекта согласования.</param>
        /// <param name="recordId">Идентификатор записи объекта согласования.</param>
        /// <returns>Данные файлов объекта согласования.</returns>
        public virtual EntityCollection GetApprovalObjectFiles(Guid objectId, Guid recordId)
        {
            var approvalObjectSchemaUId = GetApprovalObjectSchemaUId(objectId);
            var approvalObjectSchema = _userConnection.EntitySchemaManager.GetInstanceByUId(approvalObjectSchemaUId);
            var fileSchemaName = $"{approvalObjectSchema.Name}File";
            var fileSchema = _userConnection.EntitySchemaManager.GetInstanceByName(fileSchemaName);

            if (fileSchema is null)
            {
                var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "SchemaNotFoundError");
                throw new Exception(string.Format(errorMessage, fileSchemaName));
            }

            var connectionColumn = GetObjectsConnectionColumn(fileSchemaName, approvalObjectSchema.Name);

            var esq = new EntitySchemaQuery(_userConnection.EntitySchemaManager, fileSchema.Name);
            esq.PrimaryQueryColumn.IsAlwaysSelect = true;
            esq.AddColumn("Name");

            esq.Filters.Add(
                esq.CreateFilterWithParameters(
                    FilterComparisonType.Equal,
                    connectionColumn.Name,
                    recordId));

            return esq.GetEntityCollection(_userConnection);
        }

        /// <summary>
        /// Возвращает идентификатор записи объекта согласования артефакта.
        /// </summary>
        /// <param name="artifactId">Идентификатор артефакта.</param>
        /// <returns>Идентификатор записи объекта согласования.</returns>
        public virtual Guid GetArtifactApprovalObjectRecordId(Guid artifactId)
        {
            var approvalObjectSchemaName = GetArtifactApprovalObjectSchemaName(artifactId);
            var connectionColumn = GetObjectsConnectionColumn(nameof(SrmArtifact), approvalObjectSchemaName);

            var select = new Select(_userConnection)
                .Column(connectionColumn.ColumnValueName)
                .From(nameof(SrmArtifact))
                .Where(nameof(SrmArtifact.Id))
                .IsEqual(Column.Parameter(artifactId)) as Select;

            var masterRecordId = select.ExecuteScalar<Guid>();

            if (Guid.Empty.Equals(masterRecordId))
            {
				var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "GetArtifactApprovalObjectRecordId");
                throw new Exception(errorMessage);
            }

            return select.ExecuteScalar<Guid>();
        }

        /// <summary>
        /// Возвращает колонку связи объектов.
        /// </summary>
        /// <param name="schemaName">Название объекта, в котором ищем колонку.</param>
        /// <param name="relatedSchemaName">Название объекта, связь с которым ищем.</param>
        /// <returns>Колонка связи объектов.</returns>
        public virtual EntitySchemaColumn GetObjectsConnectionColumn(string schemaName, string relatedSchemaName)
        {
            var schema = _userConnection.EntitySchemaManager.GetInstanceByName(schemaName);
            var relatedSchema = _userConnection.EntitySchemaManager.GetInstanceByName(relatedSchemaName);

            var connectionColumn = schema.Columns
                .Where(x => x.ReferenceSchemaUId.Equals(relatedSchema.UId))
                .FirstOrDefault();

            if (connectionColumn is null)
            {
                var errorMessage = _userConnection.GetLocalizableString(nameof(SrmApprovalServiceHelper), "GetObjectsConnectionColumnError");
                throw new Exception(string.Format(errorMessage, schema.Caption, relatedSchema.Caption));
            }

            return connectionColumn;
        }

        /// <summary>
        /// Возвращает название схемы объекта согласования артефакта.
        /// </summary>
        /// <param name="artifactId">Идентификатор артефакта.</param>
        /// <returns>Название схемы объекта согласования.</returns>
        protected virtual string GetArtifactApprovalObjectSchemaName(Guid artifactId)
        {
            var select = new Select(_userConnection)
                .Column("o", nameof(SrmApprovalObject.SrmEntitySchemaName))
                .From(nameof(SrmArtifact)).As("a")
                    .InnerJoin(nameof(SrmArtifactVariety)).As("v")
                    .On("a", nameof(SrmArtifact.SrmArtifactVarietyId))
                    .IsEqual("v", nameof(SrmArtifactVariety.Id))
                    .InnerJoin(nameof(SrmApprovalObject)).As("o")
                    .On("o", nameof(SrmApprovalObject.Id))
                    .IsEqual("v", nameof(SrmArtifactVariety.SrmObjectId))
                .Where("a", nameof(SrmArtifact.Id))
                .IsEqual(Column.Parameter(artifactId)) as Select;

            var approvalObjectSchemaName = select.ExecuteScalar<string>();

            if (string.IsNullOrEmpty(approvalObjectSchemaName))
            {
                throw new Exception("1");
            }

            return approvalObjectSchemaName;
        }
    }
}