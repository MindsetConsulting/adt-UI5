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

            // fetchEmployeeSkills: function () {
            //     var oModel = this.getOwnerComponent().getModel();

            //     // Make an OData call to retrieve skills for the employee
            //     oModel.read("/Employee?$filter=Id eq (guid'" + sEmployeeId + "')/to_skill_rating", {
            //         success: function (oData) {
            //             // Update the binding of _empSkills table with the retrieved data
            //             var oTable = this.byId("_empSkills");
            //             var oBinding = oTable.getBinding("items");
            //             oBinding.getModel().setData(oData); // Assuming the oData contains the skills data
            //         }.bind(this),
            //         error: function () {
            //             // Handle error
            //             MessageToast.show("Error fetching skills for the employee");
            //         }
            //     });
            // },

            fetchEmployeeSkills: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sEmployeeId = '185b6714-4112-11ee-be56-0242ac120002'; // Replace with your actual employee ID
                
                // Use createKey to form the correct URL for to_skill_rating
                var sSkillRatingUrl = "/Employee(guid'" + sEmployeeId + "')";


                // TODO: the below returns an object {__metadata: {…}, Id: '185b6714-4112-11ee-be56-0242ac120002', Name: 'PATTI SMITH', Department: 'POETRY', StartDate: Tue Sep 05 2023 19:00:00 GMT-0500 (Central Daylight Time), …} 

                // Make an OData call to retrieve skills for the employee
                oModel.read(sSkillRatingUrl, {
                    success: function (oData) {
                        // Update the binding of _empSkills table with the retrieved data
                        // var oTable = this.byId("_empSkills");
                        // var oBinding = oTable.getBinding("items");
                        console.log('oData is:', oData)
                        // oBinding.getModel().setData(oData); // Assuming the oData contains the skills data

                        // *******// FIXME: does not work 
                        // Access the deferred URI for to_skill_rating
                        // var toSkillRatingURI = oData.to_skill_rating.__deferred.uri;
                        // var toSkillRatingURI = "Employee(guid'185b6714-4112-11ee-be56-0242ac120002')/to_skill_rating";


                        // Make a separate request to fetch the to_skill_rating data
                        // oModel.read(toSkillRatingURI, {
                        //     success: function (toSkillRatingData) {
                        //         // Here, toSkillRatingData will contain the to_skill_rating data
                        //         console.log("to_skill_rating data:", toSkillRatingData);
                        //     },
                        //     error: function () {
                        //         // Handle error
                        //         MessageToast.show("Error fetching to_skill_rating data");
                        //     }
                        // });

                        // FIXME: does not work     
                        // fetch(`https://S4HANA2022.MINDSETCONSULTING.COM:44301/sap/opu/odata/sap/ZASSOCIATE_DEV_EMP_API/Employee(guid'185b6714-4112-11ee-be56-0242ac120002')/to_skill_rating`, {
                        //     method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
                        //     headers: {
                        //         'Content-Type': 'application/json', // adjust accordingly
                        //         // Add any other headers you need
                        //     },
                        // })
                        //     .then(response => {
                        //         if (!response.ok) {
                        //             throw new Error('Network response was not ok');
                        //         }
                        //         return response.json(); // or response.text() if expecting a different type of response
                        //     })
                        //     .then(data => {
                        //         // Handle the data returned from the server
                        //         console.log('Data:', data);
                        //     })
                        //     .catch(error => {
                        //         // Handle errors
                        //         console.error('Error:', error);
                        //     });

// *********

                    }
                        // .bind(this)
                    ,

                    error: function () {
                        // Handle error
                        MessageToast.show("Error fetching skills for the employee");
                    }
                });
            },


            getEmployeeId: function (sObjectId) {
                var match = sObjectId.match(/'([^']+)'/);
                if (match && match[1]) {
                    // var viewModel = this.getView().getModel("viewModel");
                    // viewModel.setProperty("/employeeId", match[1]);
                    sEmployeeId = match[1]
                    this.fetchEmployeeSkills();
                } else {
                    return null;
                }
            },

            onEditPress: function () {
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", true);
            },

            onSavePress: function () {
                var viewModel = this.getView().getModel("viewModel");

                // Check if ZipCode and Email are in error state
                var zipCodeInput = this.byId("_ZipCode");
                var emailInput = this.byId("_Email");
                var isZipCodeValid = zipCodeInput.getValueState() !== sap.ui.core.ValueState.Error;
                var isEmailValid = emailInput.getValueState() !== sap.ui.core.ValueState.Error;

                if (!isZipCodeValid || !isEmailValid) {
                    // Display an error message
                    MessageToast.show("Please correct the fields in red");
                    return;
                }

                // Proceed with saving and updating the entity
                viewModel.setProperty("/editMode", false);
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
                var editedData = {};

                var inputFields = ["_Department", "_Role", "_Address", "_CityState", "_ZipCode", "_Email", "_PhoneNumber"];
                inputFields.forEach(function (field) {
                    var inputControl = this.byId(field);
                    editedData[field.substring(1)] = inputControl.getValue();
                }, this);

                var dateToConvert = this.byId("_StartDate").getValue();
                var ticks = Date.parse(dateToConvert);
                editedData.StartDate = "\/Date(" + ticks + ")\/";

                return editedData;
            },


            updateEntityInModel: function (editedData) {
                var oViewModel = this.getView().getModel("viewModel");
                var oModel = this.getOwnerComponent().getModel();
                var empId = sEmployeeId;

                // Save the changes to the server
                oModel.update("/Employee(guid'" + empId + "')", editedData, {
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
                this.getEmployeeId(sObjectId);
            },

            onNavBack: function () {
                history.go(-1);
            }
        });
    });

