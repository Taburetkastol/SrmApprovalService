define("SrmApprovalObjectPage", [], function() {
	return {
		entitySchemaName: "SrmApprovalObject",
		attributes: {
			/** Схема объекта. */
			"SysEntitySchema": {
				dataValueType: BPMSoft.DataValueType.LOOKUP,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				isLookup: true,
				lookupListConfig: {
					columns: ["UId", "Caption", "Name"],
					filter: function() {
						return this.getSysEntitySchemaFilter();
					}
				},
				referenceSchema: {
					name: "VwSysSchemaInfo",
					primaryColumnName: "Name",
					primaryDisplayColumnName: "Caption"
				},
				referenceSchemaName: "VwSysSchemaInfo"
			},
			/** Идентификатор схемы объекта. */
			"SysEntitySchemaUId": {
				dependencies: [{
					columns: ["SysEntitySchema"],
					methodName: "onSysEntitySchemaChanged"
				}]
			},
			/** Название. */
			"Name": {
				dataValueType: BPMSoft.DataValueType.TEXT,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: "Name"
			},
			/** Видимость детали. */
			"IsDetailVisible": {
				"dataValueType": this.BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
			/** Режим добавления. */
			"IsAddMode": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"SrmApprovalObjectColumnDetail": {
				"schemaName": "SrmApprovalObjectColumnDetail",
				"entitySchemaName": "SrmApprovalObjectColumn",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "SrmObject"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			/**
			 * Обработчик изменения поля SysEntitySchema.
			 * @protected
			 */
			onSysEntitySchemaChanged: function() {
				const schema = this.get("SysEntitySchema");
				this.set("SrmSchemaUId", schema?.UId);
				this.set("SrmEntitySchemaName", schema?.Name);
				this.set("SrmName", schema?.Caption);
			},
			
			/**
			 * Returns SysEntitySchema filter.
			 * @protected
			 * @returns {BPMSoft.FilterGroup} Filter group
			 */
			getSysEntitySchemaFilter: function(){
				const filters = this.Ext.create("BPMSoft.FilterGroup");
				filters.addItem(this.BPMSoft.createColumnFilterWithParameter(
					this.BPMSoft.ComparisonType.EQUAL,
					"SysWorkspace",
					this.BPMSoft.SysValue.CURRENT_WORKSPACE.value
				));
				filters.addItem(this.BPMSoft.createColumnFilterWithParameter(
					this.BPMSoft.ComparisonType.EQUAL,
					"ManagerName",
					"EntitySchemaManager"
				));
				return filters;
			},

			/**
			 * @inheritdoc BPMSoft.BasePageV2#onEntityInitialized
			 * @overridden
			 */
			onEntityInitialized: function () {
				this.callParent(arguments);
				this.setPageCaptionHeader();
				const entitySchemaName = this.get("SrmEntitySchemaName");
				this.BPMSoft.require([entitySchemaName], function() {
					this.set("IsDetailVisible", true);
				}, this);
			},

			/**
			 * @inheritDoc BasePageV2#initActionButtonMenu
			 * @overridden
			 */
			initActionButtonMenu: function() {
				this.set("ActionsButtonVisible", false);
			},

			/**
			 * Устанавливает заголовок страницы.
			 * @protected
			 * @virtual
			 */
			setPageCaptionHeader: function () {
				const selectQuery = Ext.create("BPMSoft.EntitySchemaQuery", {
					rootSchemaName: "SysSchema"
				});
				selectQuery.addColumn("Caption");
				selectQuery.filters.add(
					"SysSchemaCaptionFilter",
					selectQuery.createColumnFilterWithParameter(
						BPMSoft.ComparisonType.EQUAL,
						"UId",
						this.get("SrmSchemaUId")
					)
				);
				selectQuery.getEntityCollection(function(response) {
					if (response && response.success) {
						const collection = response.collection;

						if (collection.getCount() > 0) {
							const entitySchema = collection.getByIndex(0);
							const entitySchemaCaption = entitySchema.get("Caption");
							this.sandbox.publish("UpdatePageHeaderCaption", {
								pageHeaderCaption: entitySchemaCaption
							});
						}
					}
				}, this);
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "remove",
				"name": "Name"
			},
			{
				"operation": "remove",
				"name": "Description"
			},
			{
				"operation": "remove",
				"name": "GeneralInfoTabContainer"
			},
			{
				"operation": "insert",
				"name": "SrmApprovalObjectColumnTab",
				"parentName": "Tabs",
				"propertyName": "tabs",
				"values": {
					"caption": { "bindTo": "Resources.Strings.SrmApprovalObjectColumnTabCaption"},
					"items": []
				}
			},
			{
				"operation": "insert",
				"parentName": "SrmApprovalObjectColumnTab",
				"propertyName": "items",
				"name": "SrmApprovalObjectColumnDetail",
				"values": {
					"itemType": BPMSoft.ViewItemType.DETAIL,
					"visible": {
						"bindTo": "IsDetailVisible"
					}
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
