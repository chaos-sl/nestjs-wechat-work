"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WechatWorkAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
let WechatWorkAuthGuard = WechatWorkAuthGuard_1 = class WechatWorkAuthGuard {
    constructor(wechatWorkAuthService) {
        this.wechatWorkAuthService = wechatWorkAuthService;
        this.logger = new common_1.Logger(WechatWorkAuthGuard_1.name);
    }
    canActivate(context) {
        const ctx = context.switchToHttp().getResponse();
        const req = context.switchToHttp().getRequest();
        const isMobile = req.query.mobile === 'true';
        return this.wechatWorkAuthService.validateContext(ctx, isMobile);
    }
};
WechatWorkAuthGuard = WechatWorkAuthGuard_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [services_1.WechatWorkAuthService])
], WechatWorkAuthGuard);
exports.WechatWorkAuthGuard = WechatWorkAuthGuard;
