define("SrmApprovalObjectColumnDetail", [
	"ConfigurationGrid",
	"ConfigurationGridGenerator",
	"ConfigurationGridUtilities"
], function() {
	return {
		entitySchemaName: "SrmApprovalObjectColumn",
		attributes: {
			"IsEditable": {
				"dataValueType": this.BPMSoft.DataValueType.BOOLEAN,
				"type": this.BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": false
			},
			"SrmEntitySchemaName": {
				dataValueType: BPMSoft.DataValueType.TEXT,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN
			}
		},
		mixins: {
			ConfigurationGridUtilites: "BPMSoft.ConfigurationGridUtilities"
		},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		methods: {
			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getGridSettingsMenuItem
			 * @overridden
			 */
			getGridSettingsMenuItem: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getSwitchGridModeMenuItem
			 * @overridden
			 */
			getSwitchGridModeMenuItem: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetail#hideQuickFilterButton
			 * @overridden
			 */
			getHideQuickFilterButton: function() {
				return false;
			},

			/**
			 * @inheritdoc BPMSoft.BaseGridDetail#getQuickFilterButton
			 * @overridden
			 */
			getShowQuickFilterButton: BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getCopyRecordMenuItem
			 * @overridden
			 */
			getCopyRecordMenuItem: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getEditRecordMenuItem
			 * @overridden
			 */
			getEditRecordMenuItem: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getGridSortMenuItem
			 * @overridden
			 */
			getGridSortMenuItem: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#sortColumn
			 * @overridden
			 */
			sortColumn: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#getAddRecordButtonVisible
			 * @overridden
			 */
			getAddRecordButtonVisible: function() {
				return true;
			},

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#addDetailWizardMenuItems
			 * @overridden
			 */
			addDetailWizardMenuItems: this.BPMSoft.emptyFn,

			/**
			 * @inheritdoc BaseGridDetailV2#addRecord
			 * @overridden
			 */
			addRecord: function() {
				const entitySchemaName = this.get("SrmEntitySchemaName");
				this.BPMSoft.StructureExplorerUtilities.open({
					scope: this,
					handlerMethod: this.addCallback,
					moduleConfig: {
						schemaName: entitySchemaName,
						lookupsColumnsOnly: true,
						useBackwards: false,
						firstColumnsOnly: true
					}
				});
			},

			/**
			 * Callback добавления записи.
			 * @param {Object} result
			 * @protected
			 */
			addCallback: function(result) {
				if (this.isColumnAdded(result.metaPath[0])) {
					this.showInformationDialog(this.get("Resources.Strings.DuplicateColumnMessage"));
					return;
				}
				
				const insertQuery = this.getApprovalColumnsInsertQuery(result);
				insertQuery.execute(function() {
					this.reloadGridData();
				}, this);
			},

			/**
			 * Создает запрос для добавления колонки, которая может быть использована для согласования.
			 * @param {Object} columnInfo Информация о колонке.
			 * @returns {BPMSoft.InsertQuery} Запрос на добавление.
			 */
			getApprovalColumnsInsertQuery: function(columnInfo) {
				const masterRecordId = this.get("MasterRecordId");
				const insertQuery = this.Ext.create("BPMSoft.InsertQuery", {
					rootSchemaName: "SrmApprovalObjectColumn"
				});
				insertQuery.setParameterValue("SrmObject", masterRecordId, this.BPMSoft.DataValueType.GUID);
				insertQuery.setParameterValue("SrmColumnUId", columnInfo.metaPath[0], this.BPMSoft.DataValueType.GUID);
				insertQuery.setParameterValue("SrmColumnName", columnInfo.caption[0], this.BPMSoft.DataValueType.TEXT);
				insertQuery.setParameterValue("SrmColumnCode", columnInfo.path[0], this.BPMSoft.DataValueType.TEXT);
				insertQuery.setParameterValue("SrmColumnSchemaName", columnInfo.referenceSchemaName, this.BPMSoft.DataValueType.TEXT);
				return insertQuery;
			},

			/**
			 * Проверка, добавлена ли колонка.
			 * @param columnUId UId колонки.
			 * @returns {boolean} Колонка добавлена.
			 */
			isColumnAdded: function(columnUId) {
				const gridData = this.getGridData();
				const collection = gridData.getItems();

				for (let i = 0; i < gridData.getCount(); i++) {
					if (collection[i].values.SrmColumnUId === columnUId) {
						return true;
					}
				}

				return false;
			},

			/**
			 * Возвращает значение колонки родительской записи.
			 * @private
			 * @param {String} columnName Название колонки.
			 */
			getValueByName: function(columnName) {
				const names = this.sandbox.publish("GetColumnsValues", [columnName], [this.sandbox.id]);
				return names[columnName];
			},

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#init
			 * @overridden
			 */
			init: function() {
				this.callParent(arguments);
				const entitySchemaNameColumn = "SrmEntitySchemaName";
				const entitySchemaName = this.getValueByName(entitySchemaNameColumn);
				this.set("SrmEntitySchemaName", entitySchemaName);
			},

			/**
			 * @inheritdoc BPMSoft.BaseGridDetailV2#prepareResponseCollectionItem:
			 * @overridden
			 */
			prepareResponseCollectionItem: function(item) {
				this.callParent(arguments);
				const entitySchemaName = this.get("SrmEntitySchemaName");
				const columns = this.BPMSoft[entitySchemaName].columns;
				this.BPMSoft.each(columns, function(column) {
					if (column.uId === item.get("SrmColumnUId")) {
						item.set("SrmColumnUId", column.caption);
					}
				}, this);
			}
		}
	};
});