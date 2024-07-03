define("SrmArtifactFileDetail", [], function() {
	return {
		entitySchemaName: "SrmArtifactFile",
		attributes: {},
		messages: {},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "remove",
				"name": "DragAndDrop Container"
			},
			{
				"operation": "remove",
				"name": "AddRecordButton"
			},
			{
				"operation": "remove",
				"name": "AddFiles Container"
			},
			{
				"operation": "remove",
				"name": "AddFilesTiled Container"
			}
		]/**SCHEMA_DIFF*/,
		methods: {
			getAddLinkMenuItem: BPMSoft.emptyFn,
			getDeleteRecordMenuItem: BPMSoft.emptyFn,
			
			/**
			 * @inheritdoc BPMSoft.FileDetailV2#init
			 * @overridden
			 */
			init: function() {
				this.callParent(arguments);
				this.set("SchemaCardName", "SrmArtifactFilePage");
			}
		}
	};
});