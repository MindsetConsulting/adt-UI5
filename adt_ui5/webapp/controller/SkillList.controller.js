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
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            var oListItem = oEvent.getSource().getParent().getParent(); // Adjust this based on your view structure
            var sPath = oListItem.getBindingContext("viewModel").getPath(); // Use the view model's context

            // Find the index of the edited skill in the array
            var iIndex = parseInt(sPath.split("/")[2]);

            if (iIndex >= 0 && iIndex < aSkills.length) {
                // Set the skill at the specified index in edit mode
                aSkills[iIndex].editMode = true;
                oViewModel.refresh();
            }
        },





        // works for addNew only 
        // onSaveSkillPress: function (oEvent) {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     var aSkills = oViewModel.getProperty("/Skills");

        //     // Find the skill that is in edit mode
        //     var editedSkill = aSkills.find(function (skill) {
        //         return skill.editMode === true;
        //     });

        //     if (editedSkill) {
        //         // Prepare the skill object for updating by removing the editMode property
        //         var skillToUpdate = {
        //             Name: editedSkill.Name,
        //             SkillId: editedSkill.SkillId // Use the existing SkillId
        //         };

        //         // Perform the PATCH request to update the skill
        //         var oModel = this.getOwnerComponent().getModel();
        //         oModel.update("/Employee_Skills_CRUD('" + skillToUpdate.SkillId + "')", skillToUpdate, {
        //             success: function () {
        //                 // Handle success
        //                 editedSkill.editMode = false; // Set back to view mode
        //                 oViewModel.refresh(); // Refresh the binding to reflect the change
        //             },
        //             error: function () {
        //                 // Handle error
        //                 sap.m.MessageToast.show("Failed to update the skill. Please try again.");
        //             }
        //         });
        //     }
        // },

// works for editing skill only
//         onSaveSkillPress: function (oEvent) {
//     var oViewModel = this.getView().getModel("viewModel");
//     var aSkills = oViewModel.getProperty("/Skills");

//     // Find the new skill that is in edit mode
//     var editedSkill = aSkills.find(function (skill) {
//         return skill.editMode === true;
//     });

//     if (editedSkill) {
//         // Save the edited skill
//         editedSkill.editMode = false; // Set back to view mode
//         oViewModel.refresh(); // Refresh the binding to reflect the change

//         // Prepare the skill object for updating by removing the editMode property
//         var skillToUpdate = Object.assign({}, editedSkill); // Clone the skill object
//         delete skillToUpdate.editMode; // Remove the editMode property

//         // Perform the PATCH/UPDATE request to update the skill
//         var oModel = this.getOwnerComponent().getModel(); // Get the OData model
//         oModel.update("/Employee_Skills_CRUD(guid'" + skillToUpdate.SkillId + "')", skillToUpdate, {
//             success: function () {
//                 // Handle success
//             },
//             error: function () {
//                 // Handle error
//                 sap.m.MessageToast.show("Failed to update the skill. Please try again.");
//             }
//         });
//     }
// },
        


        onSaveSkillPress: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
            var aSkills = oViewModel.getProperty("/Skills");

            // Find the new skill that is in edit mode
            var newSkill = aSkills.find(function (skill) {
                return skill.editMode === true;
            });

            if (newSkill) {
                // Set back to view mode and refresh the binding
                newSkill.editMode = false;
                oViewModel.refresh();

                // Generate a new UUID for the skill
                newSkill.SkillId = this.generateUUID();

                // Prepare the skill object for creating by removing the editMode property
                var skillToCreate = Object.assign({}, newSkill); // Clone the skill object
                delete skillToCreate.editMode; // Remove the editMode property

                // Perform the POST request to create the skill
                var oModel = this.getOwnerComponent().getModel(); // Get the OData model
                oModel.create("/Employee_Skills_CRUD", skillToCreate, {
                    success: function () {
                        // Handle success
                    },
                    error: function () {
                        // Handle error
                        sap.m.MessageToast.show("Failed to create the skill. Please try again.");
                        aSkills.pop(); // Remove the skill from the viewModel
                        oViewModel.refresh(); // Refresh the binding to reflect the change
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
