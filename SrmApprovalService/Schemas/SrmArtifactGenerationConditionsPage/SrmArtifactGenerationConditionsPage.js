define("SrmArtifactGenerationConditionsPage", [], function() {
	return {
		entitySchemaName: "SrmArtifactGenerationConditions",
		attributes: {
			/** Вид артефакта. */
			"SrmArtifactVariety": {
				"lookupListConfig": {
					"columns": ["SrmObject"]
				}
			},
			/** Поле. */
			"SrmField": {
				"lookupListConfig": {
					"filters": [
						function () {
							const filterGroup = Ext.create("BPMSoft.FilterGroup");
							const artifactVariety = this.get("SrmArtifactVariety");
							
							filterGroup.addItem(BPMSoft.createColumnFilterWithParameter(
								BPMSoft.ComparisonType.EQUAL,
								"SrmObject",
								artifactVariety?.SrmObject?.value));

							return filterGroup;
						}
					]
				}
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			/**
			 * Переопределение базового метода "save".
			 * @overridden
			 */
			save: function() {
				this.setValidationConfig();
				this.callParent(arguments);
			},
			
			/**
			 * Переопределение базового метода "setValidationConfig".
			 * @overridden
			 */
			setValidationConfig: function() {
				this.callParent(arguments);
				this.addColumnValidator("SrmOriginalValue", this.getGuidTextValueValidator);
				this.addColumnValidator("SrmTargetValue", this.getGuidTextValueValidator);
			},
			
			/**
			 * Возвращает валидатор поля для ввода идентификатора.
			 */
			getGuidTextValueValidator: function(value) {
				const regex = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/gm;

				if (regex.exec(value) == null) {
					return {
						invalidMessage: this.get("Resources.Strings.GuidTextValueInvalidMessage"),
						isValid: false
					}
				}
				
				return {
					invalidMessage: "",
					isValid: true
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
					"bindTo": "SrmName"
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
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "SrmArtifactVariety"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "SrmOriginalValue",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "SrmOriginalValue"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SrmTargetValue",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "SrmTargetValue"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "SrmField",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "SrmField"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			}
		]/**SCHEMA_DIFF*/
	};
});
