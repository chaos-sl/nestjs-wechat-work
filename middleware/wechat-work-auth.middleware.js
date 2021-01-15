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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const queryString = require("query-string");
const wechat_work_config_1 = require("../wechat-work.config");
const services_1 = require("../services");
const constants_1 = require("../constants");
const interfaces_1 = require("../interfaces");
const utils_1 = require("../utils");
let WechatWorkAuthMiddleware = class WechatWorkAuthMiddleware {
    constructor(config, wechatWorkBaseService, wechatWorkContactsService) {
        this.config = config;
        this.wechatWorkBaseService = wechatWorkBaseService;
        this.wechatWorkContactsService = wechatWorkContactsService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { corpId, agentId } = this.config.baseConfig;
            const { returnDomainName, loginPath, logoutPath, loginSuccessPath, loginFailPath, tokenName = constants_1.DEFAULT_TOKEN_NAME, tokenExpires = constants_1.DEFAULT_TOKEN_EXPIRES, jwtSecret, } = this.config.authConfig;
            const redirectUri = decodeURIComponent((req.query.redirect_uri ||
                '/'));
            const loginFailPathObj = queryString.parseUrl(loginFailPath);
            if (req.route.path === loginPath) {
                if (req.query.code) {
                    let userIdData;
                    try {
                        userIdData = yield this.wechatWorkBaseService.getUserId(req.query
                            .code);
                    }
                    catch (err) {
                        userIdData = {};
                    }
                    if (!userIdData.UserId) {
                        loginFailPathObj.query.result = interfaces_1.AuthFailResult.QueryUserIdFail;
                        return res.redirect(returnDomainName + queryString.stringifyUrl(loginFailPathObj));
                    }
                    let userInfoData;
                    try {
                        userInfoData = yield this.wechatWorkContactsService.getUserInfo(userIdData.UserId);
                    }
                    catch (err) {
                        userInfoData = {};
                    }
                    if (!userInfoData.userid) {
                        loginFailPathObj.query.result = interfaces_1.AuthFailResult.QueryUserInfoFail;
                        return res.redirect(returnDomainName + queryString.stringifyUrl(loginFailPathObj));
                    }
                    if (userInfoData.status !== 1) {
                        loginFailPathObj.query.result = interfaces_1.AuthFailResult.UserInactive;
                        return res.redirect(returnDomainName + queryString.stringifyUrl(loginFailPathObj));
                    }
                    const departmentDetail = [];
                    let departmentInfoData;
                    try {
                        departmentInfoData = yield this.wechatWorkContactsService.getAllDepartmentList();
                    }
                    catch (err) {
                        departmentInfoData = {};
                    }
                    if (!departmentInfoData.errcode) {
                        for (const item of userInfoData.department) {
                            departmentDetail.push(utils_1.flatten(utils_1.getPathById(item, departmentInfoData.department)));
                        }
                    }
                    const userData = {
                        userId: userIdData.UserId,
                        name: userInfoData.name,
                        email: userInfoData.email,
                        avatar: userInfoData.avatar,
                        phone: userInfoData.telephone,
                        mobile: userInfoData.mobile,
                        status: userInfoData.status,
                        nickName: userInfoData.alias,
                        thumb_avatar: userInfoData.thumb_avatar,
                        address: userInfoData.address,
                        qr_code: userInfoData.qr_code,
                        departmentDetail,
                    };
                    const jwtToken = jsonwebtoken_1.sign(userData, jwtSecret, {
                        expiresIn: tokenExpires,
                    });
                    return res
                        .cookie(tokenName, jwtToken, {
                        httpOnly: true,
                        secure: false,
                        expires: new Date(Date.now() + tokenExpires * 1000),
                    })
                        .redirect(`${returnDomainName}${loginSuccessPath}/?redirect_uri=${redirectUri}`);
                }
                else {
                    if (req.query.state) {
                        loginFailPathObj.query.result = interfaces_1.AuthFailResult.UserRejectQrCode;
                        return res.redirect(returnDomainName + queryString.stringifyUrl(loginFailPathObj));
                    }
                    else {
                        if (req.query.mobile === 'true') {
                            return res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${encodeURIComponent(returnDomainName +
                                loginPath +
                                '?mobile=true&redirect_uri=' +
                                redirectUri)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`);
                        }
                        else {
                            return res.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${corpId}&agentid=${agentId}&redirect_uri=${encodeURIComponent(returnDomainName +
                                loginPath +
                                '?mobile=false&redirect_uri=' +
                                redirectUri)}&state=STATE`);
                        }
                    }
                }
            }
            else if (req.route.path === logoutPath) {
                return res.clearCookie(tokenName).redirect(loginSuccessPath);
            }
            else {
                next();
            }
        });
    }
};
WechatWorkAuthMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [wechat_work_config_1.WechatWorkConfig,
        services_1.WechatWorkBaseService,
        services_1.WechatWorkContactsService])
], WechatWorkAuthMiddleware);
exports.WechatWorkAuthMiddleware = WechatWorkAuthMiddleware;
