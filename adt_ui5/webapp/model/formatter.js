sap.ui.define([], function () {
    "use strict";

    return {

        formatDate: function (sDateTime) {
            if (sDateTime) {
                var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss.SSSX"
                }); // 2020-06-17T07:06:29.251Z
                // var oDisplayFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});//sap.ui.core.format.DateFormat.getDateInstance({pattern: this.formatter.getDateDisplayFormat(sRegion)});
                var oDisplayFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "MM/dd/yyyy"
                });
                //hh:mm:ss aaa"
                try {
                    if (!oFormat.parse(sDateTime)) {
                        return sDateTime;
                    } else {
                        return oDisplayFormat.format(oFormat.parse(sDateTime));
                    }
                } catch (e) {
                    return sDateTime;
                }

            } else {
                return sDateTime;
            }
        }

    };
});