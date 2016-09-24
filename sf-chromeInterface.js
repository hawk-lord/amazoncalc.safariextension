/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const SfChromeInterface = function(aConversionEnabled) {
    "use strict";
    let buttonStatus = aConversionEnabled;
    const onBrowserAction = function(event) {
        if (event.command === "toggle") {
            buttonStatus = !buttonStatus;
            const checkToggleButton = function(element) {
                if (element && element.identifier === "amazong-button") {
                    element.badge = buttonStatus ? 1 : 0;
                }
            };
            safari.extension.toolbarItems.forEach(checkToggleButton);
            eventAggregator.publish("toggleConversion", buttonStatus);
        }
    };
    const setConversionButtonState = function(aStatus) {
        const checkToggleButton = function(element) {
            if (element && element.identifier === "amazong-button") {
                element.badge = buttonStatus ? 1 : 0;
            }
        };
        safari.extension.toolbarItems.forEach(checkToggleButton);
    };
    safari.application.addEventListener("command", onBrowserAction, false);
    return {
        setConversionButtonState: setConversionButtonState
    }
};
