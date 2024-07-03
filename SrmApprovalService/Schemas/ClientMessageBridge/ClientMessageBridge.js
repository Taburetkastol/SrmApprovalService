define("ClientMessageBridge", [],
    function() {
        return {
            messages: {
                "FieldValueNotValid": {
                    "mode": BPMSoft.MessageMode.BROADCAST,
                    "direction": BPMSoft.MessageDirectionType.PUBLISH
                }
            },
            methods: {
                init: function() {
                    this.callParent(arguments);
                    this.addMessageConfig({
                        sender: "FieldValueNotValid",
                        messageName: "FieldValueNotValid"
                    });
                }
            }
        };
    });