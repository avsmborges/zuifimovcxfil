sap.ui.define(["sap/m/MessageBox"],
    function (MessageBox) {
        "use strict";
        return {

            openAppTab: function (oEvt) {
                var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var sBupla = this.getView().byId("br.com.dellavolpe.zuifimovcxfil::sap.suite.ui.generic.template.ListReport.view.ListReport::MovimentCxFilial--listReportFilter").getFilterData()["Bupla"];
                if (sBupla === undefined) {
                    MessageBox.error(oResourceBundle.getText("selecionarFilial"));
                } else {
                    var oNavigationController = this.extensionAPI.getNavigationController();
                    oNavigationController.navigateExternal(
                        oEvt.getSource().getId().substring(oEvt.getSource().getId().lastIndexOf("--") + 2),
                        {
                            bupla: sBupla
                        });
                }
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
