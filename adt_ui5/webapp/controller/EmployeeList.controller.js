sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "../model/formatter"

],
    function (Controller, UIComponent, JSONModel, MessageToast, formatter) { 
        "use strict";
        var controller, component;
        return Controller.extend("mindset.adt.ui5.adtui5.controller.EmployeeList", {
            formatter: formatter,
            onInit: function () {
                controller = this;

                component = this.getOwnerComponent();

                var oViewModel = new JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                    selectedItemsCount: null,
                    newEmployee: {
                        Name: "",
                        Department: "",
                        StartDate: null,
                        Role: "",
                        Id: this.generateUUID()
                    }

                });
                this.oView.setModel(oViewModel, "viewModel");
                // Dialog instantiation
                this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "mindset.adt.ui5.adtui5.view.fragments.AddEmployeeDialog", this);
                this.getView().addDependent(this._oDialog);

            },

            generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
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
                            console.log('deleted successfully');
                            MessageToast.show("Employee deleted");
                        },
                        error: function () {
                            // Handle deletion error
                            MessageToast.show("Error, employee not deleted");
                        }
                    });
                });

                oTable.removeSelections();
            },

            onOpenEmployeeDialog: function () {
                this._oDialog.open();
            },

            onCancelEmployeeDialog: function () {
                this._oDialog.close();
                // this._oDialog.destroy();
            },

            onAddEmployeeDialogPress: function () {
                var oViewModel = this.getView().getModel("viewModel");
                var oNewEmployee = oViewModel.getProperty("/newEmployee");

                // Perform validation if needed
                if (!oNewEmployee.Name || !oNewEmployee.Department || !oNewEmployee.StartDate || !oNewEmployee.Role) {
                    // Display error message or handle validation
                    return;
                }

                // Assuming you have a reference to your main model
                var oModel = this.getView().getModel();

                // Create the new employee data
                oModel.create("/Employee", oNewEmployee, {
                    success: function () {
                        // Handle successful creation
                        console.log('Employee added successfully');
                        MessageToast.show("Employee created");
                        oViewModel.setProperty("/newEmployee", {
                            Name: "",
                            Department: "",
                            StartDate: null,
                            Role: "",
                            Id: ""
                        });
                    },
                    error: function () {
                        // Handle creation error
                        console.log('Error adding employee');
                        MessageToast.show("Error, employee not created");
                    }
                });

                this._oDialog.close();
            },

            formatDate: function (sTimestamp) {
                if (typeof sTimestamp === "string") {
                    var timestamp = parseInt(sTimestamp.match(/\d+/)[0]);
                    var date = new Date(timestamp);
                    var formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        date.getDate().toString().padStart(2, '0') + '/' +
                        date.getFullYear();
                    return formattedDate;
                }
                return "";
            },

            onSkillListNav: function () {
                this.getRouter().navTo("SkillList");
            }

        });
    });
