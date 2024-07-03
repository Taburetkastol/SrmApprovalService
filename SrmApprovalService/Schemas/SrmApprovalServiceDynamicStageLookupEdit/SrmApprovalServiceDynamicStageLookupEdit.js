define("SrmApprovalServiceDynamicStageLookupEdit", ["BPMSoft", "ext-base"], function(BPMSoft, Ext) {
	Ext.define("BPMSoft.controls.SrmApprovalServiceDynamicStageLookupEdit", {
		extend: "BPMSoft.controls.LookupEdit",
		alternateClassName: "BPMSoft.SrmApprovalServiceDynamicStageLookupEdit",
		
		/** Название схемы объекта источника данных. */
		valueColumnReferenceSchemaName: "",
		
		/**
		 * Переопределение базового метода BPMSoft.LookupEdit#getBindConfig.
		 * @overridden
		 */
		getBindConfig: function() {
			let bindConfig = this.callParent(arguments);
			
			let editBindConfig = {
				valueColumnReferenceSchemaName: {
					changeMethod: "onValueColumnReferenceSchemaNameChanged"
				}
			};
			
			Ext.apply(bindConfig, editBindConfig);
			return bindConfig;
		},
		
		/**
		 * Обработчик изменения объекта источника данных.
		 */
		onValueColumnReferenceSchemaNameChanged: function(value) {
			if (value && value.SrmColumnSchemaName) {
				this.valueColumnReferenceSchemaName = value.SrmColumnSchemaName;
			}
		},
		
		/**
		 * Переопределение базового метода BPMSoft.LookupEdit#changeValue.
		 * @overridden
		 */
		changeValue: function(item) {
			let value = this.value;
			let isChanged = (value || item) && (value !== item);
			
			if (isChanged) {
				this.value = item;
				let returnValue = BPMSoft.deepClone(item);
				this.fireEvent("change", returnValue, this);
				this.setClearIconVisibility();
			}
			
			return isChanged;
		},
		
		/**
		 * Переопределение базового метода BPMSoft.LookupEdit#setValue.
		 * @overridden
		 */
		setValue: function(value) {
			const isChanged = this.changeValue(value);
			
			if (this.rendered && isChanged) {
				value = (value) ? value : "";
				
				if (value) {
					const esq = Ext.create("BPMSoft.EntitySchemaQuery", {
						rootSchemaName: this.valueColumnReferenceSchemaName
					});
					esq.addMacrosColumn(BPMSoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "displayValue");
					esq.getEntity(value, function(result) {
						if (result.success) {
							this.setDomValue(result.entity.get("displayValue"));
							this.setElementDirection(this.getEl(), this.value);
							this.setElementDirection(this.getLinkEl(), this.value);
						}
					}, this);
				} else {
					this.setDomValue(value);
				}
			}
			
			return isChanged;
		},
		
		/**
		 * Переопределение базового метода BPMSoft.LookupEdit#getInitValue.
		 * @overridden
		 */
		getInitValue: function() {
			const value = this.value;
			return Ext.isEmpty(value) ? "" : value;
		}
	});
});