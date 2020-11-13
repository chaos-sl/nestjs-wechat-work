export interface AccessTokenInfo {
    getTime: number;
    expiresIn: number;
    accessToken: string;
}
export declare enum AgentType {
    Custom = "Custom",
    Contacts = "Contacts",
    Telephone = "Telephone",
    Schedule = "Schedule",
    Customer = "Customer",
    Attendance = "Attendance",
    Approval = "Approval",
    Hongbao = "Hongbao"
}
export declare enum AuthFailResult {
    UserRejectQrCode = "UserRejectQrCode",
    QueryUserIdFail = "QueryUserIdFail",
    QueryUserInfoFail = "QueryUserInfoFail",
    UserInactive = "UserInactive"
}
export interface Result {
    errcode: number;
    errmsg: string;
}
export interface WechatWorkData {
    [key: string]: any;
}
