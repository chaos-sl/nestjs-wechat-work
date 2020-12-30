export interface BaseConfig {
  corpId: string;
  agentId?: string;
  agentSecret: string;
  contactsSecret?: string /* 获取成员详细信息,必填 */;
  telephoneSecret?: string;
  scheduleSecret?: string;
  customerSecret?: string;
  attendanceAgentId?: string;
  attendanceSecret?: string;
  approvalAgentId?: string;
  approvalSecret?: string;
  hongbaoAgentId?: string;
  hongbaoSecret?: string;
}

export interface AuthConfig {
  returnDomainName: string;
  loginPath?: string;
  logoutPath?: string;
  loginSuccessPath?: string;
  loginFailPath?: string;
  noRedirectPaths?: string[];
  tokenName?: string;
  tokenExpires?: number;
  jwtSecret: string;
}

export class WechatWorkConfig {
  baseConfig: BaseConfig;
  authConfig?: AuthConfig;
}
