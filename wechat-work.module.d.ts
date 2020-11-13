import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { WechatWorkConfig } from './wechat-work.config';
export declare class WechatWorkModule implements NestModule {
    private readonly config;
    constructor(config: WechatWorkConfig);
    static register(config: WechatWorkConfig): DynamicModule;
    configure(consumer: MiddlewareConsumer): void;
}
