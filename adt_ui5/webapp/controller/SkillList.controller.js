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

            // this.getRouter().getRoute("SkillList").attachPatternMatched(this._onObjectMatched, this);
        }

        // onRouteMatched: function (oEvent) {
        //     var sRouteName = oEvent.getParameter("name");
        //     if (sRouteName === "SkillsList") {
        //         // Implement any logic that needs to be executed when this route is matched
        //         console.log("SkillsList route matched");
        //     }
        // },

        // getRouter: function () {
        //     return UIComponent.getRouterFor(this);
        // }

        // ... (other event handlers)
    });
});
