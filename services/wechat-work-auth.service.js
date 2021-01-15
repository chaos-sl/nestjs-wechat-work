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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var WechatWorkAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cookie = require("cookie");
const jsonwebtoken_1 = require("jsonwebtoken");
const wechat_work_config_1 = require("../wechat-work.config");
const constants_1 = require("../constants");
let WechatWorkAuthService = WechatWorkAuthService_1 = class WechatWorkAuthService {
    constructor(config) {
        this.logger = new common_1.Logger(WechatWorkAuthService_1.name);
        this.config = config;
    }
    validateContext(ctx, mobile = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let isNoRedirectPath = false;
            for (const item of this.config.authConfig.noRedirectPaths) {
                if (ctx.req.route.path.indexOf(item) === 0) {
                    isNoRedirectPath = true;
                    this.logger.debug(`No Redirect ` + item);
                    break;
                }
            }
            let token = '';
            const tokenName = this.config.authConfig.tokenName || constants_1.DEFAULT_TOKEN_NAME;
            const cookies = cookie.parse(ctx.req.headers.cookie);
            const tokenFromCookie = cookies[tokenName] || '';
            if (tokenFromCookie) {
                token = tokenFromCookie;
                this.logger.debug(`Token From Cookie ` + token);
            }
            else {
                const authorizationStr = ctx.req.headers && ctx.req.headers.authorization;
                if (!authorizationStr) {
                    if (isNoRedirectPath) {
                        return false;
                    }
                    else {
                        this.logger.debug(`No Authorization String , Redirect to QRCode`);
                        this.redirectWechatWorkQrCodePage(ctx, mobile);
                    }
                }
                const [bearer, tokenFromAuthorization] = authorizationStr.split(' ');
                if (bearer !== 'Bearer' || !tokenFromAuthorization) {
                    if (isNoRedirectPath) {
                        throw new common_1.HttpException('Not found token', common_1.HttpStatus.UNAUTHORIZED);
                    }
                    else {
                        this.logger.debug(`No Token String Or Not Bearer, Redirect to QRCode`);
                        this.redirectWechatWorkQrCodePage(ctx, mobile);
                    }
                }
                token = tokenFromAuthorization;
            }
            if (!token) {
                if (isNoRedirectPath) {
                    throw new common_1.HttpException('Not found token', common_1.HttpStatus.UNAUTHORIZED);
                }
                else {
                    this.logger.debug(`No Token At All , Redirect to QRCode`);
                    this.redirectWechatWorkQrCodePage(ctx, mobile);
                }
            }
            const user = yield this.validateUserToken(token, ctx, isNoRedirectPath, mobile);
            ctx.req.user = user;
            return true;
        });
    }
    validateUserToken(token, ctx, isNoRedirectPath, mobile = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedToken = jsonwebtoken_1.verify(token, this.config.authConfig.jwtSecret);
                if (!verifiedToken || !verifiedToken.userId) {
                    if (isNoRedirectPath) {
                        throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
                    }
                    else {
                        this.logger.debug(`Token Invalid , Redirect to QRCode`);
                        this.redirectWechatWorkQrCodePage(ctx, mobile);
                    }
                }
                return verifiedToken;
            }
            catch (e) {
                if (isNoRedirectPath) {
                    throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
                }
                else {
                    console.debug(e);
                    this.logger.debug(`Verify Token Exception , Redirect to QRCode`);
                    this.redirectWechatWorkQrCodePage(ctx, mobile);
                }
            }
        });
    }
    redirectWechatWorkQrCodePage(ctx, mobile = false) {
        const { corpId, agentId } = this.config.baseConfig;
        const { returnDomainName, loginPath } = this.config.authConfig;
        if (mobile) {
            ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${encodeURIComponent(returnDomainName + loginPath + '?mobile=true')}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`);
        }
        else {
            ctx.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${corpId}&agentid=${agentId}&redirect_uri=${encodeURIComponent(returnDomainName + loginPath)}&state=STATE`);
        }
    }
};
WechatWorkAuthService = WechatWorkAuthService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [wechat_work_config_1.WechatWorkConfig])
], WechatWorkAuthService);
exports.WechatWorkAuthService = WechatWorkAuthService;
