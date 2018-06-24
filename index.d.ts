import { IamportPayment } from "./iamport.payment";
import { Platform } from "ionic-angular";
import { InAppBrowser } from '@ionic-native/in-app-browser';
export declare class IamportService {
    private platform;
    private inAppBrowser;
    constructor(platform: Platform, inAppBrowser: InAppBrowser);
    private static parseQuery(query);
    payment(userCode: string, param: any): Promise<IamportPayment>;
}
