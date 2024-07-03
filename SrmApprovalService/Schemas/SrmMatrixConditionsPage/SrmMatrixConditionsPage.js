define("SrmMatrixConditionsPage", [], function() {
	return {
		entitySchemaName: "SrmMatrixConditions",
		attributes: {
			/** Матрица согласования. */
			"SrmMatrixCoordination": {
				"lookupListConfig": {
					"columns": ["SrmReconcilingTemplate.SrmApprovalObject"]
				}
			},
			/** Поле. */
			"SrmField": {
				"lookupListConfig": {
					"filters": [
						function() {
							return BPMSoft.createColumnFilterWithParameter(
								BPMSoft.ComparisonType.EQUAL,
								"SrmObject",
								this.get("SrmMatrixCoordination")?.["SrmReconcilingTemplate.SrmApprovalObject"]);
						}
					]
				}
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "SrmComparisonOperator",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "SrmComparisonOperator",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SrmValue",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "SrmValue",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "SrmField",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "SrmField",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			}
		]/**SCHEMA_DIFF*/
	};
});
