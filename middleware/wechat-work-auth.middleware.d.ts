import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WechatWorkConfig } from '../wechat-work.config';
import { WechatWorkBaseService, WechatWorkContactsService } from '../services';
export declare class WechatWorkAuthMiddleware implements NestMiddleware {
    private readonly config;
    private readonly wechatWorkBaseService;
    private readonly wechatWorkContactsService;
    constructor(config: WechatWorkConfig, wechatWorkBaseService: WechatWorkBaseService, wechatWorkContactsService: WechatWorkContactsService);
    use(req: Request, res: Response, next: Function): Promise<void>;
}
