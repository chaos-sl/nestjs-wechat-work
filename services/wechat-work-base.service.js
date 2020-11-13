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
var WechatWorkBaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const wechat_work_config_1 = require("../wechat-work.config");
const interfaces_1 = require("../interfaces");
let WechatWorkBaseService = WechatWorkBaseService_1 = class WechatWorkBaseService {
    constructor(config, httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(WechatWorkBaseService_1.name);
        this.apiServer = 'https://qyapi.weixin.qq.com';
        this.config = config;
    }
    getAccessToken(agentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const { corpId, agentSecret, contactsSecret, telephoneSecret, scheduleSecret, customerSecret, attendanceSecret, approvalSecret, hongbaoSecret, } = this.config.baseConfig;
            let secret = '';
            if (agentType === interfaces_1.AgentType.Custom) {
                secret = agentSecret;
            }
            if (agentType === interfaces_1.AgentType.Contacts) {
                secret = contactsSecret ? contactsSecret : agentSecret;
            }
            if (agentType === interfaces_1.AgentType.Telephone) {
                secret = telephoneSecret;
            }
            if (agentType === interfaces_1.AgentType.Schedule) {
                secret = scheduleSecret ? scheduleSecret : agentSecret;
            }
            if (agentType === interfaces_1.AgentType.Customer) {
                secret = customerSecret ? customerSecret : agentSecret;
            }
            if (agentType === interfaces_1.AgentType.Attendance) {
                secret = attendanceSecret;
            }
            if (agentType === interfaces_1.AgentType.Approval) {
                secret = approvalSecret ? approvalSecret : agentSecret;
            }
            if (agentType === interfaces_1.AgentType.Hongbao) {
                secret = hongbaoSecret;
            }
            if (!secret) {
                throw new common_1.HttpException(`[getAccessToken] must be set agentType: ${agentType}'s secret`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!this.accessTokenInfo ||
                (this.accessTokenInfo &&
                    Date.now() - this.accessTokenInfo.getTime >
                        this.accessTokenInfo.expiresIn * 1000)) {
                this.logger.log(`[getAccessToken] use api`);
                const result = yield this.httpService
                    .get(`${this.apiServer}/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${secret}`)
                    .toPromise();
                if (result.data.errcode) {
                    this.logger.error(`[getAccessToken] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`);
                    throw new common_1.HttpException(`[getAccessToken] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                this.accessTokenInfo = {
                    accessToken: result.data.access_token,
                    expiresIn: result.data.expires_in,
                    getTime: Date.now(),
                };
            }
            return this.accessTokenInfo.accessToken;
        });
    }
    getUserId(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code) {
                this.logger.log(`[getUserId] code cannot be empty`);
                throw new common_1.HttpException('[getUserId] code cannot be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = yield this.getAccessToken(interfaces_1.AgentType.Contacts);
            const result = yield this.httpService
                .get(`${this.apiServer}/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`)
                .toPromise();
            if (result.data.errcode) {
                this.logger.error(`[getUserId] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`);
                throw new common_1.HttpException(`[getUserId] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return result.data;
        });
    }
};
WechatWorkBaseService = WechatWorkBaseService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [wechat_work_config_1.WechatWorkConfig,
        common_1.HttpService])
], WechatWorkBaseService);
exports.WechatWorkBaseService = WechatWorkBaseService;
