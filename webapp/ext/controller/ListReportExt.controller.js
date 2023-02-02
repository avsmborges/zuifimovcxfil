sap.ui.define(["sap/m/MessageBox"],
    function (MessageBox) {
        "use strict";
        return {

            openAppTab: function (oEvt) {
                var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var aFilterData = this.getView().byId(this.getView().getId() + "--listReportFilter").getFilterData();
                var sBupla = aFilterData["Bupla"];
                var sBudat = aFilterData["Budat"];
                var sNav = oEvt.getSource().getId().substring(oEvt.getSource().getId().lastIndexOf("--") + 2);
                if (sBupla === undefined || sBudat === undefined) {
                    MessageBox.error(oResourceBundle.getText("selecionarFilialDtLancamento"));
                } else {
                    this._oView.setBusy(true);
                    this._oModel.callFunction("/validateAberturaFechamento", {
                        "method": "GET",
                        urlParameters: {
                            Zdiamesano: sBudat,
                            Zfilial:sBupla
                        },
                        success: function (oData) {
                            this._oView.setBusy(false);
                            if(oData.Zbloq === "X"){
                                MessageBox.error(oResourceBundle.getText("filialDataBloqueados"));
                            }else{
                                var oNavigationController = this.extensionAPI.getNavigationController();
                                oNavigationController.navigateExternal(
                                    sNav,
                                    {
                                        param: sBupla
                                    });
                                    
                            }
                                }.bind(this),
                        error: function () {
                            this._oView.setBusy(false);
                            MessageBox.error(oResourceBundle.getText("erroAberturaFechamento"));
                        }.bind(this)
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
                this._oView = this.getView();
                this._oModel = this.getOwnerComponent().getModel();
            },
            onBeforeRebindTableExtension: function () {
                this._bSearch = true;
            }
        };
    });
