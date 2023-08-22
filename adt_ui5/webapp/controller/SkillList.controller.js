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
                    oViewModel.setProperty("/Skills", oData.results); // Assuming the skills are returned as an array
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

        onSaveSkillPress: function (oEvent) {
            var oModel = this.getView().getModel();
            var oContext = oEvent.getSource().getBindingContext();
            var sSkillPath = oContext.getPath();
            var sSkillName = oModel.getProperty(sSkillPath + "/skillName").trim();

            // Save the edited skill name and set back to view mode
            oModel.setProperty(sSkillPath + "/skillName", sSkillName);
            oModel.setProperty(sSkillPath + "/editMode", false);
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
