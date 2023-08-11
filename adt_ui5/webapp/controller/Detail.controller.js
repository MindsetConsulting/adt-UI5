sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent, Filter, Sorter) {
        "use strict";
        var controller, component;
        return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {
            onInit: function () {
                controller = this;
                component = this.getOwnerComponent();

                var oUriParams = jQuery.sap.getUriParameters();
                var sEmployeeId = oUriParams.get("employeeId");
                
                var oViewModel = new JSONModel({
                    editMode: false,
                    busy: true,
                    delay: 0,
                    employeeId: this.getEmployeeId(),
                    editMode: false

                });
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
                this.oView.setModel(oViewModel, "viewModel");

            }, 

            getEmployeeId: function () {
                var hash = this.getRouter().oHashChanger.hash;
                var match = hash.match(/\/\('(\d+)'\)/);

                if (match && match[1]) {
                    return match[1]; // This will return the captured numeric part
                } else {
                    return null; // Return a default value or handle the case where no match is found
                }
            },

            onEditPress: function () {
                //sets edit mode for applicable fields
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", true)
                //opens footer
                // var oObjectPage = this.getView().byId("employeeDetailPage"),
                //     bCurrentShowFooterState = oObjectPage.getShowFooter();
                // oObjectPage.setShowFooter(!bCurrentShowFooterState);
            },

            onSavePress: function () {
                var viewModel = this.getView().getModel("viewModel");
                viewModel.setProperty("/editMode", false)
            },

            _bindView: function (sObjectPath) {
                var oViewModel = this.oView.getModel("objectView");

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
            },
            onNavBack: function () {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            }
        });
    });
