define("SrmArtifactFilePage", [],
	function() {
		return {
			methods: {},
			diff: /**SCHEMA_DIFF*/[
				{
					"operation": "insert",
					"parentName": "LinkPageGeneralBlock",
					"propertyName": "items",
					"name": "SrmIsRequiresApproval",
					"values": {
						"bindTo": "SrmIsRequiresApproval",
						"layout": {
							"column": 0,
							"row": 2,
							"colSpan": 11
						}
					}
				}
			]/**SCHEMA_DIFF*/
		};
	}
);