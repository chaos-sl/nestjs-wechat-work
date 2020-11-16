import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as cookie from 'cookie';
import { verify } from 'jsonwebtoken';
import { WechatWorkConfig } from '../wechat-work.config';
import { DEFAULT_TOKEN_NAME } from '../constants';

@Injectable()
export class WechatWorkAuthService {
  private readonly logger = new Logger(WechatWorkAuthService.name);
  public readonly config: WechatWorkConfig;
  constructor(config: WechatWorkConfig) {
    this.config = config;
  }

  async validateContext(ctx: any, mobile: boolean = false) {
    // noRedirectPaths 开头的地址跳转控制权交给前端
    let isNoRedirectPath = false;

    for (const item of this.config.authConfig.noRedirectPaths) {
      if (ctx.req.route.path.indexOf(item) === 0) {
        isNoRedirectPath = true;
        break;
      }
    }

    let token = '';
    // 先从cookie中取token
    const tokenName = this.config.authConfig.tokenName || DEFAULT_TOKEN_NAME;
    const cookies = cookie.parse(ctx.req.headers.cookie);
    const tokenFromCookie = cookies[tokenName] || '';

    if (tokenFromCookie) {
      token = tokenFromCookie;
    } else {
      // 如果cookie中没有token再从header中取authorization
      const authorizationStr = ctx.req.headers && ctx.req.headers.authorization;

      if (!authorizationStr) {
        if (isNoRedirectPath) {
          return false;
        } else {
          this.redirectWechatWorkQrCodePage(ctx, mobile);
        }
      }

      const [bearer, tokenFromAuthorization] = authorizationStr.split(' ');
      if (bearer !== 'Bearer' || !tokenFromAuthorization) {
        if (isNoRedirectPath) {
          throw new HttpException('Not found token', HttpStatus.UNAUTHORIZED);
        } else {
          this.redirectWechatWorkQrCodePage(ctx, mobile);
        }
      }

      token = tokenFromAuthorization;
    }

    if (!token) {
      if (isNoRedirectPath) {
        throw new HttpException('Not found token', HttpStatus.UNAUTHORIZED);
      } else {
        this.redirectWechatWorkQrCodePage(ctx, mobile);
      }
    }

    const user = await this.validateUserToken(
      token,
      ctx,
      isNoRedirectPath,
      mobile,
    );
    ctx.req.user = user;
    return true;
  }

  /**
   * 验证token是否有效
   * @param token String
   */
  async validateUserToken(
    token: string,
    ctx: any,
    isNoRedirectPath: boolean,
    mobile: boolean = false,
  ) {
    try {
      const verifiedToken = verify(token, this.config.authConfig.jwtSecret);
      if (!verifiedToken || !verifiedToken.userId) {
        if (isNoRedirectPath) {
          throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        } else {
          this.redirectWechatWorkQrCodePage(ctx, mobile);
        }
      }
      return verifiedToken;
    } catch (e) {
      if (isNoRedirectPath) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      } else {
        this.redirectWechatWorkQrCodePage(ctx, mobile);
      }
    }
  }

  redirectWechatWorkQrCodePage(ctx: any, mobile: boolean = false) {
    const { corpId, agentId } = this.config.baseConfig;
    const { returnDomainName, loginPath } = this.config.authConfig;
    if (mobile) {
      ctx.redirect(
        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${encodeURIComponent(
          returnDomainName + loginPath + '?mobile=true',
        )}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`,
      );
    } else {
      ctx.redirect(
        `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${corpId}&agentid=${agentId}&redirect_uri=${encodeURIComponent(
          returnDomainName + loginPath,
        )}&state=STATE`,
      );
    }
  }
}
