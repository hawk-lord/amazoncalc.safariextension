/**
 * Created by per on 2016-09-21.
 */


NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

if (!this.AmazonCalc) {

    const AmazonCalc = function() {
        "use strict";

        // console.log("AmazonCalc construction");


        const mutationsHandler = () => {
            clear();
            calculate();
        };

        const mutationObserver = new MutationObserver(mutationsHandler);
        const mutationObserverInit = {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: false,
            attributeOldValue: false,
            characterDataOldValue: false
        };

        // if (document.body) {
        //     mutationObserver.observe(document.body, mutationObserverInit);
        // }



        let totalPrice;

        const findTotalPriceNodeInner = (aNode) => {
            // console.log("findTotalPriceNodeInner " + aNode);
            if (!aNode) {
                return;
            }
            if (aNode.nodeType === Node.TEXT_NODE) {
                // console.log(aNode.nodeValue);
                if (aNode.nodeValue.includes("$")){
                    totalPrice = parseFloat(aNode.nodeValue.replace(/[^0-9.]/g, ""));
                    // mutationObserver.observe(aNode, mutationObserverInit);
                    // console.log("aNode.nodeValue " + aNode.nodeValue);
                    // console.log("totalPrice " + totalPrice);
                }
            }
            for (let node of aNode.childNodes) {
                findTotalPriceNodeInner(node);
            }

        };

        const findTotalPriceNode = (aNode) => {
            // console.log("findTotalPriceNode");
            let foundNode = false;
            if (aNode.nodeType === Node.TEXT_NODE) {
                if (aNode.nodeValue.includes("Subtotal")) {
                    findTotalPriceNodeInner(aNode.parentNode);
                }
            }
            if (!foundNode) {
                // reassignment of node
                for (let node of aNode.childNodes) {
                    findTotalPriceNode(node);
                }
            }
        };


        /**
         * node is taken from closure
         */
        const findPriceNode = (aNode) => {
            // console.log("findPriceNode");
            let foundNode = false;
            if (aNode.nodeType === Node.TEXT_NODE) {
                if (aNode.nodeValue.includes("$")) {
                    if (aNode.parentNode.className.includes("sc-product-price")) {
                        foundNode = true;
                        const price = parseFloat(aNode.nodeValue.replace(/[^0-9.]/g, ""));
                        const newSpanNode = document.createElement("span");
                        newSpanNode.className = "amazong";
                        aNode.parentNode.parentNode.insertBefore(newSpanNode, aNode.parentNode.nextSibling);
                        const parentDivNode = aNode.parentNode.parentNode.parentNode.parentNode;
                        let nextDiv;
                        for (let searchNode of parentDivNode.childNodes) {
                            if (searchNode.className && searchNode.className.includes("sc-action-links")) {
                                nextDiv = searchNode;
                                break;
                            }
                        }
                        if (nextDiv) {
                            const selects = nextDiv.getElementsByTagName("select");
                            for (let select of selects) {
                                if (select.name === "quantity") {
                                    const totalItemPrice = price * parseInt(select.value);
                                    const totalItemPercentage = totalItemPrice / totalPrice * 100;
                                    newSpanNode.textContent = " (total "
                                        + (totalItemPrice).toLocaleString('en-US',
                                            {style: 'currency', currency: 'USD'}) + ") | "
                                        + totalItemPercentage.toFixed(1) + "%";
                                    // console.log("select " + select.value);
                                    // select.onchange = console.log("change " + select.value);
                                    // select.addEventListener("change", calculate);
                                }
                            }
                        }
                    }
                }
            }
            if (!foundNode) {
                for (let node of aNode.childNodes) {
                    findPriceNode(node);
                }
            }
        };


        const clear = () => {
            const elementsToClear = document.getElementsByClassName("amazong");
            while (elementsToClear[0]) {
                elementsToClear[0].parentNode.removeChild(elementsToClear[0]);
            }
            // Cannot use this to remove...
            // for (let element of elementsToClear) {
            //     element.parentNode.removeChild(element);
            // }
        };

        const calculate = () => {
            // console.log("calculate");
            const activeCartViewForm = document.getElementById("activeCartViewForm");

            if (activeCartViewForm) {
                const obsNode = activeCartViewForm;
                mutationObserver.observe(obsNode, mutationObserverInit);
                // console.log("obsNode " + obsNode);
                // console.log("obsNode.nodeValue " + obsNode.nodeValue);
                for (let node of activeCartViewForm.childNodes) {
                    findTotalPriceNode(node);
                }
                for (let node of activeCartViewForm.childNodes) {
                    findPriceNode(node);
                }
            }
        };

        const onSendEnabledStatus = (aStatus) => {
            console.log("onSendEnabledStatus " + aStatus);
            if (aStatus) {
                calculate()
            }
            else {
                clear();
            }

        };

        return {
            onSendEnabledStatus: onSendEnabledStatus
        };

    }();

    this.AmazonCalc = AmazonCalc;

}

// this.AmazonCalc.calculate();
