sap.ui.define([],
    function () {
        "use strict";
        return {
            openAppTab: function (oEvt) {
                var oNavigationController = this.extensionAPI.getNavigationController();
                oNavigationController.navigateExternal(oEvt.getSource().getId().substring(oEvt.getSource().getId().lastIndexOf("--") + 2));
            },

            _refreshTable: function () {
                try {
                    if (this._bSearch) {
                        this.extensionAPI.refreshTable();
                    }
                } catch (e) {
                    //--
                }
                var refreshTable = function () { this._refreshTable() }.bind(this);
                setTimeout(refreshTable, 30000);
            },

            onInit: function () {
                this._refreshTable(this);
            },
            onBeforeRebindTableExtension: function () {
                this._bSearch = true;
            }
        };
    });
