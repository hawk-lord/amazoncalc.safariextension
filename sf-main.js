/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */


const DirectCurrencyConverter = (function() {
    "use strict";
    const informationHolder = new InformationHolder();
    const contentInterface = new SfContentInterface(informationHolder);
    const chromeInterface = new SfChromeInterface(informationHolder.conversionEnabled);
    eventAggregator.subscribe("toggleConversion", function(eventArgs) {
        contentInterface.toggleConversion(eventArgs);
        chromeInterface.setConversionButtonState(eventArgs);
    });
    contentInterface.watchForPages();
})();
