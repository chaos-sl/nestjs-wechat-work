import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WechatWorkAuthService } from '../services';
export declare class WechatWorkAuthGuard implements CanActivate {
    private readonly wechatWorkAuthService;
    private readonly logger;
    constructor(wechatWorkAuthService: WechatWorkAuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
