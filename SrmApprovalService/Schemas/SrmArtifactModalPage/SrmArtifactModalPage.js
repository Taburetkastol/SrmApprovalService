define("SrmArtifactModalPage", [
	"ModalBox",
	"ProcessModuleUtilities",
	"BusinessRuleModule",
	"css!SrmArtifactModalPageCss"
], function(ModalBox, ProcessModuleUtilities, BusinessRuleModule) {
    return {
		attributes: {
			/** Числовое поле "Срок выполнения". */
			"SrmCompletingTerm": {
				dataValueType: BPMSoft.DataValueType.INTEGER
            },
			/** Текстовое поле "Комментарий". */
			"SrmComment": {
				dataValueType: BPMSoft.DataValueType.LONG_TEXT
            }
		},
		rules: {
			/** Обязательность заполнения атрибутов для сохранения задачи. */
			"SaveButton": {
				"BindParameterSaveButtonEnabled": {
					"ruleType": BusinessRuleModule.enums.RuleType.BINDPARAMETER,
					"property": BusinessRuleModule.enums.Property.ENABLED,
					"logical": BPMSoft.LogicalOperatorType.AND,
					"conditions": [
						{
							"leftExpression": {
								"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
								"attribute": "SrmCompletingTerm"
							},
							"comparisonType": BPMSoft.ComparisonType.IS_NOT_NULL
						},
						{
							"leftExpression": {
								"type": BusinessRuleModule.enums.ValueType.ATTRIBUTE,
								"attribute": "SrmComment"
							},
							"comparisonType": BPMSoft.ComparisonType.IS_NOT_NULL
						}
					]
				},
			},
		},
        methods: {
			/** Метод инициализации модуля. */
			init: function (callback, scope) {
				this.callParent(arguments);
			},
			
			/**
			 * Метод-обработчик нажатия на кнопку "Сохранить".
			 */
			onSaveButtonClick: function() {
				const artifactId = this.get("SrmArtifactId");
                const term = this.get("SrmCompletingTerm");
                const comment = this.get("SrmComment");

				let args = {
					sysProcessName: "SrmReturnForRevisionProcess",
					parameters: {
						SrmArtifact: artifactId,
                        SrmCompletingTerm: term,
                        SrmComment: comment
					}
                };

				ProcessModuleUtilities.executeProcess(args);
				ModalBox.close();
			},
			
			/** 
			 * Метод-обработчик нажатия на кнопку "Отмена".
			 */
			onCancelButtonClick: function() {
				ModalBox.close();
			}
        },
        diff: [
			{
                "operation": "insert",
                "name": "HeaderContainer",
                "index": 0,
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["header", "modal-box-page-header-container"],
                    "items": []
                }
            },
            {
                "operation": "insert",
                "parentName": "HeaderContainer",
                "propertyName": "items",
                "name": "HeaderCaptionContainer",
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["header-name-container"],
                    "items": []
                }
            },
            {
                "operation": "insert",
                "parentName": "HeaderCaptionContainer",
                "propertyName": "items",
                "name": "HeaderCaption",
                "values": {
                    "itemType": BPMSoft.ViewItemType.LABEL,
                    "caption": {"bindTo": "Resources.Strings.SrmHeaderCaption"},
                }
            },
            {
                "operation": "insert",
                "index": 1,
                "name": "CardContentWrapper",
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["modal-box-card-content-wrap"],
                    "items": []
                }
            },
            {
                "operation": "insert",
                "parentName": "CardContentWrapper",
                "propertyName": "items",
                "name": "CardContentContainer",
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["modal-box-page-content-container"],
                    "items": []
                }
            },
            {
                "operation": "insert",
                "parentName": "CardContentContainer",
                "name": "CompletingTermInput",
                "propertyName": "items",
                "values": {
                    "bindTo": "SrmCompletingTerm",
                    "caption": {"bindTo": "Resources.Strings.SrmCompletingTermCaption"},
					"wrapClass": ["modal-box-page-comment-container"]
                },
                "index": 0
            },
            {
                "operation": "insert",
                "name": "CommentInput",
                "parentName": "CardContentContainer",
                "propertyName": "items",
                "values": {
					"className": "BPMSoft.MemoEdit",
                    "bindTo": "SrmComment",
                    "caption": {"bindTo": "Resources.Strings.SrmCommentCaption"}
                }	
            },
            {
                "operation": "insert",
                "propertyName": "items",
                "name": "CardButtonsWrapper",
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["modal-box-card-content-wrap"],
                    "items": []
                },
				"index": 2
            },
            {
                "operation": "insert",
                "propertyName": "items",
				"parentName": "CardButtonsWrapper",
                "name": "CardButtonsContainer",
                "values": {
                    "itemType": BPMSoft.ViewItemType.CONTAINER,
                    "wrapClass": ["modal-box-page-button-container"],
                    "items": []
                }
            },
            {
                "operation": "insert",
                "name": "SaveButton",
                "parentName": "CardButtonsContainer",
                "propertyName": "items",
                "values": {
                    "click": {
                        "bindTo": "onSaveButtonClick"
                    },
                    "itemType": BPMSoft.ViewItemType.BUTTON,
                    "style": BPMSoft.controls.ButtonEnums.style.ORANGE,
                    "markerValue": "SaveButton",
                    "caption": {"bindTo": "Resources.Strings.SrmSaveButtonCaption"}
                }
            },
            {
                "operation": "insert",
                "name": "CancelButton",
                "parentName": "CardButtonsContainer",
                "propertyName": "items",
                "values": {
                    "click": {
                        "bindTo": "onCancelButtonClick"
                    },
                    "itemType": BPMSoft.ViewItemType.BUTTON,
                    "style": BPMSoft.controls.ButtonEnums.style.TRANSPARENT,
                    "markerValue": "CancelButton",
                    "caption": {"bindTo": "Resources.Strings.SrmCancelButtonCaption"},
                    "classes": {
                        "wrapperClass": ["close-btn"]
                    }
                }
            }
        ]
    };
});