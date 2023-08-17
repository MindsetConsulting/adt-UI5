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

                component = this.getOwnerComponent();

                var oViewModel = new JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                    selectedItemsCount: null

                });
                this.oView.setModel(oViewModel, "viewModel");

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
                var viewModel = this.getView().getModel("viewModel");
                            
                if (viewModel) {
                    viewModel.setProperty("/selectedItemsCount", aSelectedItems.length);
                }
            
            },

            onDeleteEmployeePress: function () {
                var oTable = this.byId("table");
                var aSelectedItems = oTable.getSelectedItems();
                var oModel = this.getView().getModel();

                aSelectedItems.forEach(function (oItem) {
                    var sPath = oItem.getBindingContextPath();
                    oModel.remove(sPath, {
                        success: function () {
                            // Handle successful deletion
                            console.log('deleted successfully')
                        },
                        error: function () {
                            // Handle deletion error
                        }
                    });
                });

                oTable.removeSelections();
            }
        });
    });
