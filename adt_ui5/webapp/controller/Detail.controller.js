sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast", 
    "../model/formatter"

],
    function (Controller, JSONModel, UIComponent, Filter, Sorter, MessageToast, formatter) {
        "use strict";

        var sEmployeeId;

        return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {
            formatter: formatter,
            onInit: function () {
                var oViewModel = new sap.ui.model.json.JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                    employeeId: ""
                });
                // sap.ui.getCore().setModel(Formatter, "formatter");

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

            // getEditedData: function () {
            //     var dateToConvert = this.byId("_start").getValue();
            //     var convertedDate = this.createJSONDate(dateToConvert);
            //     return {
            //         Department: this.byId("_department").getValue(),
            //         Role: this.byId("_role").getValue(),
            //         StartDate: convertedDate
            //     };
            // },

            getEditedData: function () {
                var editedData = {};

                var inputFields = ["_Department", "_Role", "_Address", "_CityState", "_ZipCode", "_Email", "_PhoneNumber"];
                inputFields.forEach(function (field) {
                    var inputControl = this.byId(field);
                    editedData[field.substring(1)] = inputControl.getValue();
                }, this);

                var dateToConvert = this.byId("_StartDate").getValue();
                editedData.StartDate = this.createJSONDate(dateToConvert);

                return editedData;
            },


            createJSONDate: function (dateToConvert) {
                // Split the dateToConvert string to extract the month, day, and year
                var dateParts = dateToConvert.split("-");
                if (dateParts.length === 3) {
                    var year = parseInt(dateParts[2]);
                    var month = parseInt(dateParts[0]) - 1;  // Months are zero-based in JavaScript
                    var day = parseInt(dateParts[1]);

                    // Create a Date object with the extracted parts
                    var oDate = new Date(year, month, day);

                    // Convert to UTC timestamp
                    var ticks = oDate.getTime();
                    return "\/Date(" + ticks + ")\/";
                } else {
                    console.error("Invalid date format:", dateToConvert);
                    return null;
                }
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

            onZipCodeChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                // Check if the value is not empty and is a 5-digit number
                var isZipValid = /^[0-9]{5}$/.test(sValue);

                if (!isZipValid) {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    alert("Please enter a valid zip code");
                } else {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },

            onEmailChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();

                // Check if the value is not empty and has the "@" symbol and a domain
                var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sValue);

                if (!isEmailValid) {
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                    alert("Please enter a valid email");

                } else {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
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

