sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast" 

],
    function (Controller, JSONModel, UIComponent, Filter, Sorter, MessageToast) {
        "use strict";

        var sEmployeeId;

        return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {

            onInit: function () {
                var oViewModel = new sap.ui.model.json.JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                    employeeId: ""
                });

                this.getView().setModel(oViewModel, "viewModel");

                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            },

            getEmployeeId: function () {
                var match = sEmployeeId.match(/'([^']+)'/);

                if (match && match[1]) {
                    var viewModel = this.getView().getModel("viewModel");
                    viewModel.setProperty("/employeeId", match[1]);
                } else {
                    return null;
                }
            },

            onEditPress: function () {
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", true);
            },

            // onSavePress: function () {
            //     var viewModel = this.getView().getModel("viewModel");
            //     viewModel.setProperty("/editMode", false);
            // },

            onSavePress: function () {
                this.setEditMode(false);
                this.updateEntity();
            },

            setEditMode: function (editMode) {
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", editMode);
            },

            updateEntity: function () {
                var editedData = this.getEditedData();
                this.updateEntityInModel(editedData);
            },

            getEditedData: function () {
                return {
                    Department: this.byId("_department").getValue(),
                    Role: this.byId("_role").getValue()
                    // StartDate: this.byId("_start").getValue()
                };
            },

            updateEntityInModel: function (editedData) {
                var oViewModel = this.getView().getModel("viewModel");
                var oModel = this.getOwnerComponent().getModel();
                var empId = oViewModel.getProperty("/employeeId");

                // Save the changes to the server
                oModel.update("/Employee_CRUD(guid'" + empId + "')", editedData, {
                    success: function () {
                        // Handle success
                        MessageToast.show("Update successful");
                        oViewModel.refresh(); // Refresh the binding to reflect the change
                    },
                    error: function () {
                        // Handle error
                        MessageToast.show("Error, update failed");
                        oViewModel.refresh(); // Refresh the binding to reflect the change
                    }
                });
            },


            _bindView: function (sObjectPath) {
                var oViewModel = this.getView().getModel("viewModel");

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
                sEmployeeId = sObjectId;
                this.getEmployeeId();
            },

            onNavBack: function () {
                history.go(-1);
            }
        });
    });

