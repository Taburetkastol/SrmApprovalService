define("SrmArtifactPage", [
	"SrmCoreConstants",
	"ModalBox",
	"ProcessModuleUtilities",
	"SrmApprovalServiceConstants",
	"ExtendedHtmlEditModule"
], function(CoreConsts, ModalBox, ProcessModuleUtilities, SrmApprovalServiceConstants) {
	return {
		entitySchemaName: "SrmArtifact",
		attributes: {
			/** Видимость действия "Отправить на согласование". */
			"SendForApprovalActionVisible": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false,
				"dependencies": [
					{
						"columns": ["SrmOwner"],
						"methodName": "setSendForApprovalActionVisible"
					}
				]
			},
			/** Видимость действия "Отменить согласование". */
			"CancelApprovalActionVisible": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false,
				"dependencies": [
					{
						"columns": ["SrmOwner"],
						"methodName": "setCancelApprovalActionVisible"
					}
				]
			},
			/** Видимость действия "Вернуть на доработку". */
			"ReturnForRevisionActionVisible": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false
			},
			/** Видимость поля "Содержание артефакта". */
			"SrmContentVisible": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": false,
				"dependencies": [
					{
						"columns": ["SrmContent"],
						"methodName": "setContentVisible"
					}
				]
			},
			/** Матрица согласования. */
			"SrmMatrixCoordination": {
				"lookupListConfig": {
					"columns": ["SrmIsReturnRevision"]
				}
			},
			/** Подписка на сообщения с сервера. */
			"SubscribeOnMessageToClient": {
				"dataValueType": BPMSoft.DataValueType.BOOLEAN,
				"value": true
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"SrmArtifactFileDetail": {
				"schemaName": "SrmArtifactFileDetail",
				"entitySchemaName": "SrmArtifactFile",
				"filter": {
					"detailColumn": "SrmArtifact",
					"masterColumn": "Id"
				}
			},
			"SrmArtifactMatchingDetail": {
				"schemaName": "SrmArtifactMatchingDetail",
				"entitySchemaName": "SrmArtifactMatching",
				"filter": {
					"detailColumn": "SrmArtifact",
					"masterColumn": "Id"
				}
			},
			"SrmArtifactVisaDetail": {
				"schemaName": "SrmArtifactVisaDetail",
				"entitySchemaName": "SrmArtifactVisa",
				"filter": {
					"detailColumn": "SrmArtifact",
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
				this.setSendForApprovalActionVisible();
				this.setCancelApprovalActionVisible();
				this.setReturnForRevisionActionVisible();
				this.setContentVisible();
			},
			
			/**
			 * Переопределение базового метода BasePageV2#getActions.
			 * @overridden
			 */
			getActions: function() {
				const actionMenuItems = this.callParent(arguments);
				actionMenuItems.addItem(this.getButtonMenuItem({
					Type: "BPMSoft.MenuSeparator",
					Caption: ""
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.SendForApprovalActionCaption"},
					Click: {"bindTo": "sendForApproval"},
					Visible: {"bindTo": "SendForApprovalActionVisible"}
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.CancelApprovalActionCaption"},
					Click: {"bindTo": "cancelApproval"},
					Visible: {"bindTo": "CancelApprovalActionVisible"}
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.ReturnForRevisionActionCaption"},
					Click: {"bindTo": "returnForRevision"},
					Visible: {"bindTo": "ReturnForRevisionActionVisible"}
				}));
				return actionMenuItems;
			},
			
			/**
			 * Устанавливает видимость действия "Отправить на согласование".
			 */
			setSendForApprovalActionVisible: function() {
				const owner = this.get("SrmOwner");
				const status = this.get("SrmStatus");
				
				const isSendForApprovalActionVisible = (status?.value === SrmApprovalServiceConstants.SrmArtifactStatus.New
					|| status?.value === SrmApprovalServiceConstants.SrmArtifactStatus.OnRevision)
					&& owner?.value === BPMSoft.SysValue.CURRENT_USER_CONTACT.value;
				
				this.set("SendForApprovalActionVisible", isSendForApprovalActionVisible);
			},
			
			/**
			 * Устанавливает видимость действия "Отменить согласование".
			 */
			setCancelApprovalActionVisible: function() {
				const owner = this.get("SrmOwner");
				const status = this.get("SrmStatus");
				
				const isCancelApprovalActionVisible = (status?.value === SrmApprovalServiceConstants.SrmArtifactStatus.New
						|| status?.value === SrmApprovalServiceConstants.SrmArtifactStatus.OnRevision
						|| status?.value === SrmApprovalServiceConstants.SrmArtifactStatus.OnAppoval)
					  	&& owner?.value === BPMSoft.SysValue.CURRENT_USER_CONTACT.value;
				
				this.set("CancelApprovalActionVisible", isCancelApprovalActionVisible);
			},
			
			/**
			 * Устанавливает видимость действия "Вернуть на доработку".
			 */
			setReturnForRevisionActionVisible: function() {
				const isReturnRevision = this.get("SrmMatrixCoordination")?.SrmIsReturnRevision;
				
				const esq = Ext.create("BPMSoft.EntitySchemaQuery", {
					rootSchemaName: "SrmArtifactVisa"
				});
				
				esq.addAggregationSchemaColumn(
					"Id",
					BPMSoft.AggregationType.COUNT,
					"VisaCount",
					BPMSoft.AggregationEvalType.ALL
				);
				
				esq.filters.addItem(esq.createColumnFilterWithParameter(
					BPMSoft.ComparisonType.EQUAL,
					"SrmArtifact",
					this.get("Id")));
				
				esq.filters.addItem(esq.createColumnFilterWithParameter(
					BPMSoft.ComparisonType.EQUAL,
					"Status",
					CoreConsts.VisaStatus.InWork));
				
				esq.filters.addItem(esq.createColumnFilterWithParameter(
					BPMSoft.ComparisonType.EQUAL,
					"VisaOwner",
					BPMSoft.SysValue.CURRENT_USER.value));
				
				esq.getEntityCollection(function(response) {
					if (response && response.success) {
						const visaCount = response.collection.getItems()[0].get("VisaCount");
						this.set("ReturnForRevisionActionVisible", visaCount > 0 && isReturnRevision);
					}
				}, this);
			},
			
			/**
			 * Устанавливает видимость поля "Содержание артефакта".
			 */
			setContentVisible: function() {
				const content = this.get("SrmContent");
				this.set("SrmContentVisible", !Ext.isEmpty(content));
			},
			
			/**
			 * Инициализация загрузки модуля модального окна. 
			 */
            loadModalPage: function() {
				let sandbox = this.sandbox;
				let config = {
					widthPixels: 500,
					heightPixels: 300
				};
				const moduleName = "SrmArtifactModalModule";
				const moduleId = this.sandbox.id + "_" + moduleName;
				const renderTo = ModalBox.show(config, function() {
					sandbox.unloadModule(moduleId, renderTo);
				});
				this.sandbox.loadModule(moduleName, {
					id: moduleId,
					renderTo: renderTo,
					parameters: {
						ArtifactId: this.get("Id")
					}
				});
			},
			
			/** 
			 * Метод-обработчик нажатия на кнопку "Вернуть на доработку". 
			 */
			returnForRevision: function() {
				this.loadModalPage();
			},
			
			/** 
			 * Метод-обработчик нажатия на кнопку "Отправить на согласование". 
			 */
			sendForApproval: function() {
				const artifactId = this.get("Id");
				const args = {
					sysProcessName: "SrmArtifactVisaProcess",
					parameters: {
						SrmArtifact: artifactId,
						SrmRecordId: this.get("MasterRecordId")
					}
				};
				ProcessModuleUtilities.executeProcess(args);
			},
			
			/** 
			 * Вызов процесса отмены согласования артефакта.
			 */
			cancelApproval: function() {
				const artifactId = this.get("Id");
				const args = {
					sysProcessName: "SrmCancelApprovalProcess",
					parameters: {
						SrmArtifact: artifactId
					}
				};
				ProcessModuleUtilities.executeProcess(args);
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "ReturnForRevisionButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.SrmReturnForRevisionButtonCaption"
					},
					"click": {
						"bindTo": "onReturnForRevisionButtonClick"
					},
					"enabled": true,
					"classes": {
						"textClass": [
							"actions-button-margin-right"
						]
					},
					"layout": {
						"column": 1,
						"row": 12,
						"colSpan": 2,
						"rowSpan": 1
					}
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "SrmArtifactType",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "SrmArtifactType",
					"enabled": false
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SrmArtifactVariety",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "SrmArtifactVariety",
					"enabled": false,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "SrmPlannedDate",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "SrmPlannedDate",
					"enabled": false
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SrmActualDate",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "SrmActualDate",
					"enabled": false
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Content",
				"values": {
					"className": "BPMSoft.ExtendedHtmlEdit",
					"bindTo": "SrmContent",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3
					},
					"labelConfig": {
						"visible": true
					},
					"controlConfig": {
						"toolbarVisible": false
					},
					"enabled": false
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "ReconciliationTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.ReconciliationTabTabCaption"
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
				"name": "SrmArtifactMatchingDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ReconciliationTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SrmArtifactVisaDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ReconciliationTab",
				"propertyName": "items",
				"index": 1
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
				"name": "SrmArtifactFileDetail",
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
