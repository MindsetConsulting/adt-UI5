sap.ui.define([], function () {
    "use strict";

    return {
       
        formatDate: function (sStartDate) {
            if (!sStartDate) {
                return "";
            }

            // Parse the date string in the format MM-DD-YYYY
            var parts = sStartDate.split('-');
            var month = parseInt(parts[0], 10) - 1; // Adjust month (0 - 11)
            var day = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);

            // Create a Date object
            var oDate = new Date(year, month, day);

            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({ pattern: "MM/dd/yyyy" });
            return oDateFormat.format(oDate);
        }

    };
});