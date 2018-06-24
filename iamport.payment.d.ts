export declare class IamportPayment {
    private success;
    private status;
    private response;
    constructor(response: any);
    isSuccess(): boolean;
    getStatus(): string;
    getResponse(): object;
}
