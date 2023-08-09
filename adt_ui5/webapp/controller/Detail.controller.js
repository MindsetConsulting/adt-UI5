sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",


],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent) {
        "use strict";
        var controller, component;
        return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {
            onInit: function () {
                controller = this;
                component = this.getOwnerComponent();
                
                var oViewModel = new JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                });
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
                this.oView.setModel(oViewModel, "objectView");

            }, 
            _bindView: function (sObjectPath) {
                var oViewModel = this.oView.getModel("objectView");

                this.getView().bindElement({
                    path: sObjectPath,
                    events: {
                        dataReceived: function () {
                            oViewModel.setProperty("/busy", false);
                        }
                    }
                });
            },
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            _onObjectMatched: function (oEvent) {
                var sObjectId = oEvent.getParameter("arguments").employeeId;
                this._bindView("/Employee" + sObjectId);
            },
            onNavBack: function () {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            }
        });
    });
