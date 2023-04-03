sap.ui.define(["sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"],
    function (MessageBox, Fragment, JSONModel) {
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
                            Zfilial: sBupla
                        },
                        success: function (oData) {
                            this._oView.setBusy(false);
                            if (oData.Zbloq === "X") {
                                MessageBox.error(oResourceBundle.getText("filialDataBloqueados"));
                            } else {
                                var oNavigationController = this.extensionAPI.getNavigationController();
                                if (sNav === "ZUIFI_PG_AVULSO-display") {
                                    oNavigationController.navigateExternal(
                                        sNav,
                                        {
                                            Bupla: sBupla
                                        });
                                } else {
                                    oNavigationController.navigateExternal(
                                        sNav,
                                        {
                                            param: sBupla
                                        });
                                }

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
                        this._calcSaldo();
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

                this.getOwnerComponent().setModel(new JSONModel({
                    SaldoAnterior:0,
                    Entrada:0,
                    Saida: 0,
                    SaldoFinal:0

                }),"FooterModel");
                Fragment.load({
                    name: "br.com.dellavolpe.zuifimovcxfil.fragment.Footer"
                }).then(function (oContent) {
                    this.getView().byId("br.com.dellavolpe.zuifimovcxfil::sap.suite.ui.generic.template.ListReport.view.ListReport::MovimentCxFilial--page").getContent().addItem(oContent);
                }.bind(this));

            },
            onBeforeRebindTableExtension: function () {
                this._bSearch = true;
                this._calcSaldo();
            },
            _calcSaldo:function(){
                var aFilterData = this.getView().byId(this.getView().getId() + "--listReportFilter").getFilterData();
                var sBupla = aFilterData["Bupla"];
                var sBudat = aFilterData["Budat"];
                var sBukrs = aFilterData["Bukrs"].ranges && aFilterData["Bukrs"].ranges.length >0?aFilterData["Bukrs"].ranges[0].value1: aFilterData["Bukrs"].items[0].key;

                this.getOwnerComponent().setModel(new JSONModel({
                    SaldoAnterior:0,
                    Entrada:0,
                    Saida: 0,
                    SaldoFinal:0

                }),"FooterModel");

                this._oModel.callFunction("/getValoresSaldo", {
                    "method": "GET",
                    urlParameters: {
                        Bukrs: sBukrs,
                        Budat: sBudat,
                        Bupla: sBupla
                    },
                    success: function (oData) {
                        this.getOwnerComponent().setModel(new JSONModel({
                            SaldoAnterior:oData.VlrSaldoAnterior,
                            Entrada:oData.VlrEntrada,
                            Saida: oData.VlrSaida,
                            SaldoFinal:oData.VlrSaldoFinal
        
                        }),"FooterModel");
                    }.bind(this)
                });

            }
        };
    });
