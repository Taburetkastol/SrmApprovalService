define("SrmArtifactMatchingDetail", ["SrmCoreConstants", "SrmApprovalServiceConstants"], function(CoreConsts, ApprovalServiceConsts) {
	return {
		entitySchemaName: "SrmArtifactMatching",
		attributes: {},
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		methods: {
			/**
			 * Переопределение базового метода BaseGridDetailV2#addGridDataColumns.
			 * @overridden
			 */
			addGridDataColumns: function(esq) {
				this.callParent(arguments);
				
				if (!esq.columns.contains("SrmReconcilingType")) {
					esq.addColumn("SrmReconcilingType");
				}
			},

			/**
			 * Переопределение базового метода BaseGridDetailV2#editCurrentRecord.
			 * @overridden
			 */
			editCurrentRecord: function() {
				if (!this.getEditRecordButtonEnabled()) {
					return;
				}

				this.callParent(arguments);
			},
						
			/**
			 * Переопределение базового метода BaseGridDetailV2#getAddRecordButtonVisible.
			 * @overridden
			 */
			getAddRecordButtonVisible: function() {
				const artifact = this.sandbox.publish("GetColumnsValues", ["SrmStatus"], [this.sandbox.id]);
				return artifact?.SrmStatus?.value === ApprovalServiceConsts.SrmArtifactStatus.New && this.callParent(arguments);
			},

			/**
			 * Переопределение базового метода BaseGridDetailV2#getCopyRecordMenuEnabled.
			 * @overridden
			 */
			getCopyRecordMenuEnabled: function() {
				const activeRow = this.getActiveRow();
				const artifact = this.sandbox.publish("GetColumnsValues", ["SrmStatus"], [this.sandbox.id]);

				return activeRow?.get("SrmReconcilingType")?.value === CoreConsts.SrmReconcilingType.Additional
					&& artifact?.SrmStatus?.value === ApprovalServiceConsts.SrmArtifactStatus.New
					&& this.callParent(arguments);
			},
			
			/**
			 * Переопределение базового метода BaseGridDetailV2#getDeleteRecordMenuItem.
			 * @overridden
			 */
			getDeleteRecordMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.DeleteMenuCaption"},
					Click: {"bindTo": "deleteRecords"},
					Enabled: {bindTo: "getDeleteRecordButtonEnabled"},
					Visible: {bindTo: "IsEnabled"}
				});
			},

			/**
			 * Возвращает доступность действия "Удалить".
			 */
			getDeleteRecordButtonEnabled: function() {
				const activeRow = this.getActiveRow();
				const artifact = this.sandbox.publish("GetColumnsValues", ["SrmStatus"], [this.sandbox.id]);

				return activeRow?.get("SrmReconcilingType")?.value === CoreConsts.SrmReconcilingType.Additional
					&& artifact?.SrmStatus?.value === ApprovalServiceConsts.SrmArtifactStatus.New
					&& this.isAnySelected();
			},

			/**
			 * Переопределение базового метода BaseGridDetailV2#getEditRecordButtonEnabled.
			 * @overridden
			 */
			getEditRecordButtonEnabled: function() {
				const activeRow = this.getActiveRow();
				const artifact = this.sandbox.publish("GetColumnsValues", ["SrmStatus"], [this.sandbox.id]);

				return activeRow?.get("SrmReconcilingType")?.value === CoreConsts.SrmReconcilingType.Additional
					&& artifact?.SrmStatus?.value === ApprovalServiceConsts.SrmArtifactStatus.New
					&& this.callParent(arguments);
			}
		}
	};
});
