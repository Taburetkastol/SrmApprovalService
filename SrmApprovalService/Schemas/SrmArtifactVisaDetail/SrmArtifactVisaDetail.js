define("SrmArtifactVisaDetail", [], function() {
	return {
		entitySchemaName: "SrmArtifactVisa",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "remove",
				"name": "AddRecordButton"
			}
		]/**SCHEMA_DIFF*/,
		methods: {
			getCopyRecordMenuItem: BPMSoft.emptyFn,
			getEditRecordMenuItem: BPMSoft.emptyFn,
			getDeleteRecordMenuItem: BPMSoft.emptyFn,
			getExportToExcelFileMenuItem: BPMSoft.emptyFn,
			getFileImportMenuItemCfg: BPMSoft.emptyFn
		}
	};
});
