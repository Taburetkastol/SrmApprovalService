define("SrmArtifactVarietyPage", [
	"SrmArtifactVarietyPageResources",
	"SrmApprovalServiceDynamicStageLookupEdit"
], function (resources) {
	return {
		entitySchemaName: "SrmArtifactVariety",
		attributes: {
			/** Объект. */
			"SrmObject": {
				"lookupListConfig": {
					"columns": ["SrmEntitySchemaName"]
				}
			},
			/** Колонка стадии объекта. */
			"SrmObjectStageColumn": {
				"lookupListConfig": {
					"columns": ["SrmColumnSchemaName"],
					"filters": [
						function() {
							return BPMSoft.createColumnFilterWithParameter(
								BPMSoft.ComparisonType.EQUAL,
								"SrmObject",
								this.get("SrmObject"));
						}
					]
				},
				"dependencies": [
					{
						columns: ["SrmObjectStageColumn"],
						methodName: "clearApprovalStageFields"
					},
					{
						columns: ["SrmObjectStageColumn"],
						methodName: "setApprovalStageFieldsEnabled"
					}
				]
			},
			/** Статус согласования. */
			"SrmApprovalStatus": {
				"caption": resources.localizableStrings.SrmApprovalStatusCaption,
				"valueColumnName": "SrmApprovalStatusId",
				"dataValueType": this.BPMSoft.DataValueType.LOOKUP,
				"isDynamicLookup": true
			},
			/**	Доступность поля "Статус согласования". */
			"SrmApprovalStatusEnabled": {
				"dataValueType": this.BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
			/** Статус отклонения. */
			"SrmRejectionStatus": {
				"caption": resources.localizableStrings.SrmRejectionStatusCaption,
				"valueColumnName": "SrmRejectionStatusId",
				"dataValueType": this.BPMSoft.DataValueType.LOOKUP,
				"isDynamicLookup": true
			},
			/**	Доступность поля "Статус отклонения". */
			"SrmRejectionStatusEnabled": {
				"dataValueType": this.BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
			/** Статус отмены. */
			"SrmCancelStatus": {
				"caption": resources.localizableStrings.SrmCancelStatusCaption,
				"valueColumnName": "SrmCancelStatusId",
				"dataValueType": this.BPMSoft.DataValueType.LOOKUP,
				"isDynamicLookup": true
			},
			/**	Доступность поля "Статус отмены". */
			"SrmCancelStatusEnabled": {
				"dataValueType": this.BPMSoft.DataValueType.BOOLEAN,
				"value": false
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"SrmArtifactGenerationConditionsDetail": {
				"schemaName": "SrmArtifactGenerationConditionsDetail",
				"entitySchemaName": "SrmArtifactGenerationConditions",
				"filter": {
					"detailColumn": "SrmArtifactVariety",
					"masterColumn": "Id"
				}
			},
			"FileDetailV2": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "SrmArtifactVarietyFile",
				"filter": {
					"detailColumn": "SrmArtifactVariety",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			/**
			 * Переопределение базового метода BasePageV2#onEntityInitialized.
			 * @overridden
			 */
			onEntityInitialized: function() {
				this.callParent(arguments);
				this.setApprovalStageFieldsEnabled();
			},

			/**
			 * Устанавливает доступность полей статусов.
			 */
			setApprovalStageFieldsEnabled: function() {
				const objectStageColumn = this.get("SrmObjectStageColumn");
				const isObjectStageColumnNotEmpty = !Ext.isEmpty(objectStageColumn);
				this.set("SrmApprovalStatusEnabled", isObjectStageColumnNotEmpty);
				this.set("SrmRejectionStatusEnabled", isObjectStageColumnNotEmpty);
				this.set("SrmCancelStatusEnabled", isObjectStageColumnNotEmpty);
			},

			/**
			 * Очищает поля статусов.
			 */
			clearApprovalStageFields: function() {
				this.set("SrmApprovalStatusId", null);
				this.set("SrmRejectionStatusId", null);
				this.set("SrmCancelStatusId", null);
			},

			/**
			 * Переопределение базового метода BasePageV2#getLookupEntitySchemaName.
			 * @overridden
			 */
			getLookupEntitySchemaName: function (args, columnName) {
				if (this.columns[columnName].isDynamicLookup) {
					return this.get("SrmObjectStageColumn")?.SrmColumnSchemaName;
				}

				return this.callParent(arguments);
			},

			/**
			 * Загружает данные для справочных полей статусов BaseSchemaViewModel#loadVocabulary.
			 * @param {Object} args Параметры.
			 * @param {Object} columnName Название колонки.
			 */
			loadApprovalObjectStageVocabulary: function (args, columnName) {
				const schemaName = this.get("SrmObjectStageColumn")?.SrmColumnSchemaName;

				const config = {
					entitySchemaName: schemaName,
					multiSelect: false,
					columnName: columnName
				};

				this.Ext.apply(config, this.getLookupListConfig(columnName));
				const column = this.getColumnByName(columnName);
				const lookupConfig = (column && column.lookupConfig) || {};
				this.Ext.apply(config, lookupConfig);
				this.openLookup(config, this.onApprovalObjectStageLookupResult, this);
			},

			/**
			 * Обрабатывает выбранные данные справочника.
			 * @param {Object} args Параметры.
			 */
			onApprovalObjectStageLookupResult: function(args) {
				const columnName = args.columnName;
				const valueColumnName = this.columns[columnName]?.valueColumnName;
				const selectedRows = args.selectedRows;

				if (!Ext.isEmpty(valueColumnName) && !selectedRows.isEmpty()) {
					this.set(valueColumnName, selectedRows.getByIndex(0).value);
				}
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "SrmName",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "SrmName",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SrmArtifactType",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "SrmArtifactType"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "SrmObject",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "SrmObject"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SrmObjectStageColumn",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "SrmObjectStageColumn"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "SrmApprovalStatus",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"enabled": {
						"bindTo": "SrmApprovalStatusEnabled"
					},
					"controlConfig": {
						"className": "BPMSoft.SrmApprovalServiceDynamicStageLookupEdit",
						"value": {
							"bindTo": "SrmApprovalStatusId"
						},
						"valueColumnReferenceSchemaName": {
							"bindTo": "SrmObjectStageColumn"
						},
						"loadVocabulary": {
							"bindTo": "loadApprovalObjectStageVocabulary"
						}
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "SrmRejectionStatus",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 2,
						"layoutName": "Header"
					},
					"enabled": {
						"bindTo": "SrmRejectionStatusEnabled"
					},
					"controlConfig": {
						"className": "BPMSoft.SrmApprovalServiceDynamicStageLookupEdit",
						"value": {
							"bindTo": "SrmRejectionStatusId"
						},
						"valueColumnReferenceSchemaName": {
							"bindTo": "SrmObjectStageColumn"
						},
						"loadVocabulary": {
							"bindTo": "loadApprovalObjectStageVocabulary"
						}
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "SrmRejectionTemplate",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "Header"
					},
					"bindTo": "SrmRejectionTemplate"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "SrmApprovalTemplate",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 4,
						"layoutName": "Header"
					},
					"bindTo": "SrmApprovalTemplate"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 7
			},
			{
				"operation": "insert",
				"name": "SrmContent",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 5,
						"layoutName": "Header"
					},
					"bindTo": "SrmContent"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 8
			},
			{
				"operation": "insert",
				"name": "SrmCancelStatus",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "Header"
					},
					"enabled": {
						"bindTo": "SrmCancelStatusEnabled"
					},
					"controlConfig": {
						"className": "BPMSoft.SrmApprovalServiceDynamicStageLookupEdit",
						"value": {
							"bindTo": "SrmCancelStatusId"
						},
						"valueColumnReferenceSchemaName": {
							"bindTo": "SrmObjectStageColumn"
						},
						"loadVocabulary": {
							"bindTo": "loadApprovalObjectStageVocabulary"
						}
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 9
			},
			{
				"operation": "insert",
				"name": "ConditionsTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.ConditionsTabTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SrmArtifactGenerationConditionsDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ConditionsTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.FilesTabTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FileDetailV2",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "FilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
