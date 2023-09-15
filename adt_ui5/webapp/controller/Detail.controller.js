sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter"
],
    function (Controller, JSONModel, UIComponent, Filter, Sorter) {
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

            onSavePress: function () {
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", false);
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

// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/core/UIComponent",
//     "sap/ui/model/Filter",
//     "sap/ui/model/Sorter"
// ],
//     /**
//      * @param {typeof sap.ui.core.mvc.Controller} Controller
//      */
//     function (Controller, JSONModel, UIComponent, Filter, Sorter) {
//         "use strict";
//         var controller, component, sEmployeeId;
//         return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {

//             onInit: function () {
//                 var oViewModel = new sap.ui.model.json.JSONModel({
//                     editMode: false,
//                     busy: true,
//                     delay: 0,
//                     employeeId: "",
//                     editMode: false
//                 });

//                 this.getView().setModel(oViewModel, "viewModel");


//                 this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
//             },


//             getEmployeeId: function () {
//                 var match = sEmployeeId.match(/'([^']+)'/);

//                 if (match && match[1]) {
//                     // return match[1]; // This will return the captured part inside single quotes
//                     var viewModel = this.getView().getModel("viewModel");
//                     viewModel.setProperty("/employeeId", match[1]);
//                 } else {
//                     return null; // Return a default value or handle the case where no match is found
//                 }
//             },



//             onEditPress: function () {
//                 //sets edit mode for applicable fields
//                 var viewModel = this.getView().getModel("viewModel");
//                 viewModel.setProperty("/editMode", true)
//                 //opens footer
//                 // var oObjectPage = this.getView().byId("employeeDetailPage"),
//                 //     bCurrentShowFooterState = oObjectPage.getShowFooter();
//                 // oObjectPage.setShowFooter(!bCurrentShowFooterState);
//             },

//             onSavePress: function () {
//                 var viewModel = this.getView().getModel("viewModel");
//                 viewModel.setProperty("/editMode", false)
//             },

//             _bindView: function (sObjectPath) {
//                 var oViewModel = this.oView.getModel("viewModel");

//                 this.getView().bindElement({
//                     path: sObjectPath,
//                     events: {
//                         dataReceived: function () {
//                             oViewModel.setProperty("/busy", false);
//                         }
//                     }
//                 });
//             },
//             getRouter: function () {
//                 return UIComponent.getRouterFor(this);
//             },
//             _onObjectMatched: function (oEvent) {
//                 var sObjectId = oEvent.getParameter("arguments").employeeId;
//                 this._bindView("/Employee" + sObjectId);
//                 sEmployeeId = sObjectId;

                
//                 this.getEmployeeId();
//             },
//             onNavBack: function () {
//                 // eslint-disable-next-line sap-no-history-manipulation
//                 history.go(-1);
//             }
//         });
//     });
