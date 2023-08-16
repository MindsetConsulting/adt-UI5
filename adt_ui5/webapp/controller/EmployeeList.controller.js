sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel) {
        "use strict";
        var controller, component;
        return Controller.extend("mindset.adt.ui5.adtui5.controller.EmployeeList", {
            onInit: function () {
                controller = this;

                // this.getView().setModel(ViewModel);

                component = this.getOwnerComponent();

                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel);
            },
            onPress: function (oEvent) {
                // The source is the list item that got pressed
                this._showObject(oEvent.getSource());
            },
            _showObject: function (oItem) {
                this.getRouter().navTo("Detail", {
                    employeeId: oItem.getBindingContext().getPath().substring("/Employee".length)
                });
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            onSelectionChange: function () {
                var oTable = this.byId("table");
                var aSelectedItems = oTable.getSelectedItems();
                var oViewModel = this.getView().getModel("viewModel");
                console.log('in onSelectionChange');

                if (oViewModel) {
                    oViewModel.setProperty("/selectedItemsCount", aSelectedItems.length);
                }
            
            },

            onDeleteEmployeePress: function () {
                console.log('in delete');
                var oTable = this.byId("table");
                var aSelectedItems = oTable.getSelectedItems();

                // ... (your delete logic here) ...
            }
        });
    });
