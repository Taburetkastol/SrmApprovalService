namespace BPMSoft.Core.Process.Configuration
{

	using BPMSoft.Common;
	using BPMSoft.Core;
	using BPMSoft.Core.Configuration;
	using BPMSoft.Configuration.Srm;
	using BPMSoft.Core.DB;
	using BPMSoft.Core.Entities;
	using BPMSoft.Core.Factories;
	using BPMSoft.Core.Process;
	using BPMSoft.UI.WebControls.Controls;
	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;
	using System.Globalization;

	#region Class: SrmApprovalObjectRecordStageChangeUserTask

	/// <exclude/>
	public partial class SrmApprovalObjectRecordStageChangeUserTask
	{

		#region Methods: Protected

		protected override bool InternalExecute(ProcessExecutingContext context) {
			var systemUserConnection = UserConnection.AppConnection.SystemUserConnection;
			var helper = ClassFactory.Get<SrmApprovalServiceHelper>(new ConstructorArgument("userConnection", systemUserConnection));
			var objectStageColumnUId = helper.GetApprovalObjectColumnUId(SrmApprovalObjectColumn);
			var approvalObjectSchemaUId = helper.GetApprovalObjectSchemaUId(SrmApprovalObject);

			var approvalObjectSchema = UserConnection.EntitySchemaManager.GetInstanceByUId(approvalObjectSchemaUId);
			var approvalObject = approvalObjectSchema.CreateEntity(systemUserConnection);

			if (approvalObject.FetchFromDB(SrmRecordId))
			{
				var stageColumn = approvalObjectSchema.Columns.GetByUId(objectStageColumnUId);
				approvalObject.SetColumnValue(stageColumn.ColumnValueName, SrmApprovalObjectStageId);
				approvalObject.Save(false);
			}

			return true;
		}

		#endregion

		#region Methods: Public

		public override bool CompleteExecuting(params object[] parameters) {
			return base.CompleteExecuting(parameters);
		}

		public override void CancelExecuting(params object[] parameters) {
			base.CancelExecuting(parameters);
		}

		public override string GetExecutionData() {
			return string.Empty;
		}

		public override ProcessElementNotification GetNotificationData() {
			return base.GetNotificationData();
		}

		#endregion

	}

	#endregion

}

