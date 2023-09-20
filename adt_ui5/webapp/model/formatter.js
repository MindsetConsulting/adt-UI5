sap.ui.define([], function () {
    "use strict";

    return {

        formatDateForText: function (sStartDate) {
            if (!sStartDate) {
                return "";
            }

            var oDate = new Date(Date.parse(sStartDate));

            if (isNaN(oDate.getTime())) {
                console.error("Invalid date format:", sStartDate);
                return "";
            }

            oDate.setDate(oDate.getDate() + 1);

            var month = String(oDate.getMonth() + 1).padStart(2, "0");
            var day = String(oDate.getDate()).padStart(2, "0");
            var year = oDate.getFullYear();

            return month + "/" + day + "/" + year;
        },

        formatDateForDatePicker: function (sStartDate) {
            if (!sStartDate) {
                return "";
            }

            var oDate = new Date(Date.parse(sStartDate));

            if (isNaN(oDate.getTime())) {
                console.error("Invalid date format:", sStartDate);
                return "";
            }

            var month = String(oDate.getMonth() + 1).padStart(2, "0");
            var day = String(oDate.getDate()).padStart(2, "0");
            var year = oDate.getFullYear();

            return month + "/" + day + "/" + year;
        
        }

    };
});