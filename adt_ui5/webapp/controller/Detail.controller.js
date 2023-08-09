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

                // this.getView().setModel(ViewModel);

                component = this.getOwnerComponent();
                
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
                

                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel);
            }, 
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            _onObjectMatched: function (oEvent) {
                var sObjectId = oEvent.getParameter("arguments").employeeId;
                // this._bindView("/Employee" + sObjectId);
            }
        });
    });
