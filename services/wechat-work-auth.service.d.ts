import { WechatWorkConfig } from '../wechat-work.config';
export declare class WechatWorkAuthService {
    private readonly logger;
    readonly config: WechatWorkConfig;
    constructor(config: WechatWorkConfig);
    validateContext(ctx: any, mobile?: boolean): Promise<boolean>;
    validateUserToken(token: string, ctx: any, isNoRedirectPath: boolean): Promise<any>;
    redirectWechatWorkQrCodePage(ctx: any, mobile?: boolean): void;
}
