import { HttpService } from '@nestjs/common';
import { WechatWorkConfig } from '../wechat-work.config';
import { Result, WechatWorkData, AgentType } from '../interfaces';
export declare class WechatWorkBaseService {
    private readonly httpService;
    private readonly logger;
    readonly config: WechatWorkConfig;
    private accessTokenInfo;
    apiServer: string;
    constructor(config: WechatWorkConfig, httpService: HttpService);
    getAccessToken(agentType: AgentType): Promise<string>;
    getUserId(code: string): Promise<Result & WechatWorkData>;
}
