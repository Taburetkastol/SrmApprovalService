define("SrmReconcilingTemplateItemPage", [], function() {
	return {
		entitySchemaName: "SrmReconcilingTemplateItem",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"SrmSysAdminUnit": {
				"2aec9900-1e44-44be-9877-407aeadd8746": {
					"uId": "2aec9900-1e44-44be-9877-407aeadd8746",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingView"
							},
							"rightExpression": {
								"type": 0,
								"value": "1d97902f-3751-4dde-93d7-4c7c46656abc",
								"dataValueType": 10
							}
						}
					]
				},
				"d704fe53-c477-41aa-8cb9-73168da99465": {
					"uId": "d704fe53-c477-41aa-8cb9-73168da99465",
					"enabled": false,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "ConnectionType",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 1,
					"attribute": "CompanyEmployee"
				},
				"f7f8642b-1416-499b-ac8a-db9739a5175e": {
					"uId": "f7f8642b-1416-499b-ac8a-db9739a5175e",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingView"
							},
							"rightExpression": {
								"type": 0,
								"value": "1d97902f-3751-4dde-93d7-4c7c46656abc",
								"dataValueType": 10
							}
						},
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingTemplate",
								"attributePath": "SrmReconcilingObjects"
							},
							"rightExpression": {
								"type": 0,
								"value": "136b667f-f2f7-494a-ac98-3846148df481",
								"dataValueType": 10
							}
						}
					]
				}
			},
			"SrmReconcilingPhase": {
				"dc138934-3b63-482b-85cd-433805336a8d": {
					"uId": "dc138934-3b63-482b-85cd-433805336a8d",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingTemplate",
								"attributePath": "SrmReconcilingObjects"
							},
							"rightExpression": {
								"type": 0,
								"value": "136b667f-f2f7-494a-ac98-3846148df481",
								"dataValueType": 10
							}
						}
					]
				},
				"51000464-a394-4628-a662-946ef701a085": {
					"uId": "51000464-a394-4628-a662-946ef701a085",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingTemplate",
								"attributePath": "SrmReconcilingObjects"
							},
							"rightExpression": {
								"type": 0,
								"value": "136b667f-f2f7-494a-ac98-3846148df481",
								"dataValueType": 10
							}
						}
					]
				}
			},
			"SrmCalculationReconciling": {
				"0dd3644a-92ad-43dc-90d0-5a90721a6068": {
					"uId": "0dd3644a-92ad-43dc-90d0-5a90721a6068",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingView"
							},
							"rightExpression": {
								"type": 0,
								"value": "471d451b-f3e9-4560-b3c7-5fc39504710e",
								"dataValueType": 10
							}
						}
					]
				},
				"82d3e0f1-ed39-47ff-8703-31aecbae632c": {
					"uId": "82d3e0f1-ed39-47ff-8703-31aecbae632c",
					"enabled": false,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingView"
							},
							"rightExpression": {
								"type": 0,
								"value": "471d451b-f3e9-4560-b3c7-5fc39504710e",
								"dataValueType": 10
							}
						},
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "SrmReconcilingTemplate",
								"attributePath": "SrmReconcilingObjects"
							},
							"rightExpression": {
								"type": 0,
								"value": "136b667f-f2f7-494a-ac98-3846148df481",
								"dataValueType": 10
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "SrmSysAdminUnit44d194ec-4e37-4343-a994-cd07ffa70541",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					}
				}
			},
			{
				"operation": "insert",
				"name": "SrmApprovalPeriodbe1cd1ad-c2da-4ad2-b6ed-c4f3ac4bda94",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "SrmApprovalPeriod",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "merge",
				"name": "SrmPriorityApproval97e1ac3a-480b-411c-8bee-db1a51930c09",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					}
				}
			},
			{
				"operation": "merge",
				"name": "LOOKUPca28f1c6-a796-494e-80e8-ef29c613b7df",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					}
				}
			},
			{
				"operation": "remove",
				"name": "LOOKUP9c7c6053-a9d9-4d0c-8ed2-863233eadcc2"
			},
			{
				"operation": "remove",
				"name": "LOOKUP7d22c0b0-84a4-442a-b12e-1b2d3e4e83ab"
			},
			{
				"operation": "remove",
				"name": "SrmReconcilingPhasece25ac49-59fa-4d3c-a27b-c9c1232a2775"
			}
		]/**SCHEMA_DIFF*/
	};
});
