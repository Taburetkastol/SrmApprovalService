define("SrmArtifactModalModule", ["ModalBox", "BaseSchemaModuleV2"],
    function(ModalBox) {
        Ext.define("BPMSoft.configuration.SrmArtifactModalModule", {
            extend: "BPMSoft.BaseSchemaModule",
            alternateClassName: "BPMSoft.SrmArtifactModalModule",
            /**
             * @inheritDoc BPMSoft.BaseSchemaModule#generateViewContainerId
             * @overridden
             */
            generateViewContainerId: false,
			
            /**
             * @inheritDoc BPMSoft.BaseSchemaModule#initSchemaName
             * @overridden
             */
            initSchemaName: function() {
                this.schemaName = "SrmArtifactModalPage";
            },			
						
			/**
			 * Переопределение метода для передачи параметра "SrmArtifactId".
			 */
			createViewModel: function() {
				const viewModel = this.callParent(arguments);
				const parameters = this.parameters;
				
				if (parameters) {
					viewModel.set("SrmArtifactId", parameters.ArtifactId);
				}
				
				return viewModel;
			},
			
            /**
             * @inheritDoc BPMSoft.BaseSchemaModule#initHistoryState
             * @overridden
             */
            initHistoryState: BPMSoft.emptyFn,
        });
        return BPMSoft.SrmArtifactModalModule;
    });