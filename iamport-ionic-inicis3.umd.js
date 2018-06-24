(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('ionic-angular'), require('@ionic-native/in-app-browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'ionic-angular', '@ionic-native/in-app-browser'], factory) :
	(factory((global['iamport-ionic-inicis3'] = {}),global.core,global.ionicAngular,global.inAppBrowser));
}(this, (function (exports,core,ionicAngular,inAppBrowser) { 'use strict';

var IamportPayment = (function () {
    /**
     * @param {?} response
     */
    function IamportPayment(response) {
        this.success = response.success;
        this.status = response.status;
        this.response = response;
    }
    /**
     * @return {?}
     */
    IamportPayment.prototype.isSuccess = function () {
        return this.success;
    };
    /**
     * @return {?}
     */
    IamportPayment.prototype.getStatus = function () {
        return this.status;
    };
    /**
     * @return {?}
     */
    IamportPayment.prototype.getResponse = function () {
        return this.response;
    };
    return IamportPayment;
}());

var IamportService = (function () {
    /**
     * @param {?} platform
     * @param {?} inAppBrowser
     */
    function IamportService(platform, inAppBrowser$$1) {
        this.platform = platform;
        this.inAppBrowser = inAppBrowser$$1;
    }
    /**
     * @param {?} query
     * @return {?}
     */
    IamportService.parseQuery = function (query) {
        var /** @type {?} */ obj = {}, /** @type {?} */ arr = query.split('&');
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var element = arr_1[_i];
            var /** @type {?} */ pair = element.split("=");
            var /** @type {?} */ key = decodeURIComponent(pair[0]);
            var /** @type {?} */ val = decodeURIComponent(pair[1]);
            if (key === "imp_success") {
                obj["success"] = ("true" === val); //string 을 boolean 으로
            }
            else {
                obj[key] = val;
            }
        }
        return new IamportPayment(obj);
    };
    /**
     * @param {?} userCode
     * @param {?} param
     * @return {?}
     */
    IamportService.prototype.payment = function (userCode, param) {
        var _this = this;
        var /** @type {?} */ promise = new Promise(function (resolve, reject) {
            _this.platform.ready().then(function () {
                var /** @type {?} */ paymentUrl = 'iamport-checkout.html?user-code=' + userCode;
                var /** @type {?} */ redirectUrl = "http://localhost/iamport";
                var /** @type {?} */ browser = _this.inAppBrowser.create(paymentUrl, '_blank', 'location=no');
                var /** @type {?} */ paymentProgress = false;
                param.m_redirect_url = redirectUrl;
                browser.on("loadstart")
                    .subscribe(function (e) {
                    if (e.url.startsWith(redirectUrl)) {
                        var /** @type {?} */ query = e.url.substring(redirectUrl.length + 1);
                        var /** @type {?} */ data = IamportService.parseQuery(query);
                        resolve(data);
                        browser.close();
                    }
                });
                browser.on("loadstop")
                    .subscribe(function (e) {
                    if (!paymentProgress && (e.url).indexOf(paymentUrl) > -1) {
                        paymentProgress = true;
                        var /** @type {?} */ inlineCallback = "(rsp) => {\n                                                        if( rsp.success ) {\n                                                            location.href = '" + redirectUrl + "?imp_success=true&imp_uid='+rsp.imp_uid+'&merchant_uid='+rsp.merchant_uid+'&vbank_num='+rsp.vbank_num+'&vbank_name='+rsp.vbank_name;\n                                                        } else {\n                                                            location.href = '" + redirectUrl + "?imp_success=false&imp_uid='+rsp.imp_uid+'&merchant_uid='+rsp.merchant_uid+'&error_msg='+rsp.error_msg;\n                                                        }\n                                                   }";
                        var /** @type {?} */ iamport_script = "IMP.request_pay(" + JSON.stringify(param) + ", " + inlineCallback + ")";
                        browser.executeScript({
                            code: iamport_script
                        });
                    }
                }, function (e) {
                });
                browser.on("exit")
                    .subscribe(function (e) {
                    reject("사용자가 결제를 취소하였습니다.");
                });
                browser.show();
            });
        });
        return promise;
    };
    return IamportService;
}());
IamportService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
IamportService.ctorParameters = function () { return [
    { type: ionicAngular.Platform, },
    { type: inAppBrowser.InAppBrowser, },
]; };

exports.IamportService = IamportService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
