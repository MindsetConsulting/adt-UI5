sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"

], function (Controller, JSONModel, UIComponent) {
    "use strict";
    var controller, component;

    return Controller.extend("mindset.adt.ui5.adtui5.controller.SkillList", {
        onInit: function () {
            controller = this;
            component = this.getOwnerComponent();

            var oViewModel = new JSONModel({
                editMode: false,
                busy: true,
                delay: 0,
                selectedItemsCount: null,
                newSkill: {
                    Name: "",
                    SkillId: this.generateUUID()
                },
                Skills: [] // Initialize an empty Skills array
            });

            // Fetch existing skills from OData service
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Employee_Skills_CRUD", {
                success: function (oData) {
                    var skills = oData.results.map(function (skill) {
                        return {
                            Name: skill.Name,
                            SkillId: skill.SkillId,
                            editMode: false // Initialize editMode to false
                        };
                    });
                    oViewModel.setProperty("/Skills", skills);
                },
                error: function (oError) {
                    // Handle error
                }
            });

            this.getView().setModel(oViewModel, "viewModel");
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

        onAddSkillPress: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");
            var newSkill = {
                Name: "",
                SkillId: this.generateUUID(),
                editMode: true
            };
            aSkills.push(newSkill);
            oViewModel.refresh(); // Refresh the binding to reflect the change
        },



        onEditSkill: function (oEvent) {
            var oModel = this.getView().getModel();
            var oContext = oEvent.getSource().getBindingContext();
            oModel.setProperty(oContext.getPath() + "/editMode", true);
        },

        onSaveSkillPress: function () {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            // Find the new skill that is in edit mode
            var newSkill = aSkills.find(function (skill) {
                return skill.editMode === true;
            });

            if (newSkill) {
                // Save the new skill
                newSkill.editMode = false; // Set back to view mode
                oViewModel.refresh(); // Refresh the binding to reflect the change

                // Prepare the skill object for saving by removing the editMode property
                var skillToSave = Object.assign({}, newSkill); // Clone the skill object
                delete skillToSave.editMode; // Remove the editMode property

                // Perform the POST request to save the skill
                var oModel = this.getOwnerComponent().getModel(); // Get the OData model
                oModel.create("/Employee_Skills_CRUD", skillToSave, {
                    success: function () {
                        // Handle success
                    },
                    error: function () {
                        // Handle error
                        aSkills.pop(); // Remove the skill from the viewModel
                        oViewModel.refresh(); // Refresh the binding to reflect the change
                        sap.m.MessageToast.show("Failed to save the skill. Please try again.");
                    }
                });
            }
        },





        onDeleteSkill: function (oEvent) {
            var oModel = this.getView().getModel();
            var oContext = oEvent.getSource().getBindingContext();
            var sSkillPath = oContext.getPath();

            // Get the index of the skill by extracting it from the binding path
            var iIndex = parseInt(sSkillPath.split("/")[2]);

            // Remove the skill from the model's Skills array
            var aSkills = oModel.getProperty("/Skills");
            aSkills.splice(iIndex, 1);
            oModel.setProperty("/Skills", aSkills);
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onEmployeeListNav: function () {
            this.getRouter().navTo("EmployeeList");
        }

        
    });
});
