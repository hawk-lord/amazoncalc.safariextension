/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const SfContentInterface = function(anInformationHolder) {
    "use strict";
    const watchForPages = function() {
        const applicationNavigate = function(event) {
            let tab;
            if (event.target instanceof SafariBrowserTab) {
                // A background tab could be navigating.
                if (event.type === "navigate" && event.target != safari.application.activeBrowserWindow.activeTab) {
                    return;
                }
                tab = event.target;
            }
            else {
                tab = event.target.activeTab;
            }
            event.target.page.dispatchMessage("sendEnabledStatus", anInformationHolder.conversionEnabled);
        };
        // When a new tab was opened, a tab was reloaded, a new window was opened
        safari.application.addEventListener("navigate", applicationNavigate, false);
    };
    const toggleConversion = function(aStatus) {
        const sendStatusToTab = function(aTab) {
            if (aTab.page) {
                aTab.page.dispatchMessage("sendEnabledStatus", aStatus);
            }
        };
        const sendStatusToWindow = function(aWindow) {
            aWindow.tabs.forEach(sendStatusToTab);
        };
        anInformationHolder.conversionEnabled = aStatus;
        safari.application.browserWindows.forEach(sendStatusToWindow);
    };
    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion
    }
};

if (typeof exports === "object") {
    exports.SfContentInterface = SfContentInterface;
}
