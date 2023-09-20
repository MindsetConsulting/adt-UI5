sap.ui.define([], function () {
    "use strict";

    return {
        
        formatDate: function (sStartDate) {
            if (!sStartDate) {
                return "";
            }

            // Extract the timestamp from the string
            var timestamp = parseInt(sStartDate.match(/\d+/)[0], 10);

            // Create a Date object from the timestamp
            var oDate = new Date(timestamp);

            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({ pattern: "MM/dd/yyyy" });
            return oDateFormat.format(oDate);
        }

    };
});