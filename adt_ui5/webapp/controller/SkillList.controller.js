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
                    { skillName: "Skill 1" },
                    { skillName: "Skill 2" },
                    { skillName: "Skill 3" }
                ]
            });

            this.getView().setModel(oModel);

        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onEmployeeListNav: function () {
            this.getRouter().navTo("EmployeeList");
        }

        
    });
});
