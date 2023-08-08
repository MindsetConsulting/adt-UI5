sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        var controller, component;
        return Controller.extend("mindset.adt.ui5.adtui5.controller.Detail", {
            onInit: function () {
                controller = this;

                // this.getView().setModel(ViewModel);

                component = this.getOwnerComponent();
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);


                var oData = {
                    Employees: [
                        {
                            Id: "1001",
                            Name: "John Doe",
                            Department: "Sales",
                            StartDate: "2023-08-01T00:00:00Z",
                            Role: "Manager",
                            Address: "123 Main St",
                            CityState: "Anytown, USA",
                            ZipCode: "12345",
                            Email: "john.doe@example.com",
                            PhoneNumber: "555-123-4567",
                            Photo: "url/to/photo.jpg"
                        },
                        {
                            Id: "1002",
                            Name: "Jane Smith",
                            Department: "Marketing",
                            StartDate: "2023-08-01T00:00:00Z",
                            Role: "Marketing Specialist",
                            Address: "456 Oak Ave",
                            CityState: "Anothercity, USA",
                            ZipCode: "67890",
                            Email: "jane.smith@example.com",
                            PhoneNumber: "555-987-6543",
                            Photo: "url/to/photo2.jpg"
                        },
                        {
                            Id: "1003",
                            Name: "Bob Johnson",
                            Department: "IT",
                            StartDate: "2023-08-01T00:00:00Z",
                            Role: "Software Engineer",
                            Address: "789 Elm St",
                            CityState: "Techcity, USA",
                            ZipCode: "54321",
                            Email: "bob.johnson@example.com",
                            PhoneNumber: "555-555-5555",
                            Photo: "url/to/photo3.jpg"
                        }
                    ]
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);
            }
        });
    });
