sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"

], function (Controller, JSONModel, UIComponent) {
    "use strict";

    return Controller.extend("mindset.adt.ui5.adtui5.controller.SkillList", {
        onInit: function () {
            var oModel = new JSONModel({
                Skills: [
                    { skillName: "Skill 1", id: 1, editMode: false },
                    { skillName: "Skill 2", id: 2, editMode: false },
                    { skillName: "Skill 3", id: 3, editMode: false }
                ]
            });

            this.getView().setModel(oModel);

        },

        onAddSkillPress: function () {
            var oModel = this.getView().getModel();
            var aSkills = oModel.getProperty("/Skills");

            // Add a new empty skill to the model with an editMode property
            aSkills.push({ skillName: "", editMode: true });
            oModel.setProperty("/Skills", aSkills);
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

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onEmployeeListNav: function () {
            this.getRouter().navTo("EmployeeList");
        }

        
    });
});
