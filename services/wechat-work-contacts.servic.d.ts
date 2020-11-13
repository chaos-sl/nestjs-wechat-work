import { HttpService } from '@nestjs/common';
import { WechatWorkConfig } from '../wechat-work.config';
import { Result, WechatWorkData } from '../interfaces';
import { WechatWorkBaseService } from './wechat-work-base.service';
export declare class WechatWorkContactsService {
    private readonly httpService;
    private readonly wechatWorkBaseService;
    private readonly logger;
    readonly config: WechatWorkConfig;
    apiServer: string;
    constructor(config: WechatWorkConfig, httpService: HttpService, wechatWorkBaseService: WechatWorkBaseService);
    getUserInfo(userId: string): Promise<Result & WechatWorkData>;
    getDepartmentList(id: number): Promise<Result & WechatWorkData>;
    getAllDepartmentList(): Promise<Result & WechatWorkData>;
}
