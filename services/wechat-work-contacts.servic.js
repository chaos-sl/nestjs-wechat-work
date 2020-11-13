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
var WechatWorkContactsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const wechat_work_config_1 = require("../wechat-work.config");
const interfaces_1 = require("../interfaces");
const wechat_work_base_service_1 = require("./wechat-work-base.service");
let WechatWorkContactsService = WechatWorkContactsService_1 = class WechatWorkContactsService {
    constructor(config, httpService, wechatWorkBaseService) {
        this.httpService = httpService;
        this.wechatWorkBaseService = wechatWorkBaseService;
        this.logger = new common_1.Logger(WechatWorkContactsService_1.name);
        this.apiServer = 'https://qyapi.weixin.qq.com';
        this.config = config;
    }
    getUserInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                this.logger.log(`[getUserInfo] userId cannot be empty`);
                throw new common_1.HttpException('[getUserInfo] userId cannot be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = yield this.wechatWorkBaseService.getAccessToken(interfaces_1.AgentType.Contacts);
            const result = yield this.httpService.get(`${this.apiServer}/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`).toPromise();
            if (result.data.errcode) {
                this.logger.error(`[getUserInfo] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`);
                throw new common_1.HttpException(`[getUserInfo] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return result.data;
        });
    }
    getDepartmentList(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                this.logger.log(`[getDepartmentList] userId cannot be empty`);
                throw new common_1.HttpException('[getDepartmentList] userId cannot be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = yield this.wechatWorkBaseService.getAccessToken(interfaces_1.AgentType.Contacts);
            const result = yield this.httpService.get(`${this.apiServer}/cgi-bin/department/list?access_token=${accessToken}&id=${id}`).toPromise();
            if (result.data.errcode) {
                this.logger.error(`[getDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`);
                throw new common_1.HttpException(`[getDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return result.data;
        });
    }
    getAllDepartmentList() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.wechatWorkBaseService.getAccessToken(interfaces_1.AgentType.Contacts);
            const result = yield this.httpService.get(`${this.apiServer}/cgi-bin/department/list?access_token=${accessToken}`).toPromise();
            if (result.data.errcode) {
                this.logger.error(`[getAllDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`);
                throw new common_1.HttpException(`[getAllDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return result.data;
        });
    }
};
WechatWorkContactsService = WechatWorkContactsService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [wechat_work_config_1.WechatWorkConfig,
        common_1.HttpService,
        wechat_work_base_service_1.WechatWorkBaseService])
], WechatWorkContactsService);
exports.WechatWorkContactsService = WechatWorkContactsService;
