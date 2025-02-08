import { UserInformation } from "./userInformation";

export interface DirectoryInfomation {
  seq: string;
  directoryName: string;
  directorySlug: string;
  icon: string;
  directoryCode: string;
  parentDirectoryCode: string;
}

export interface RoleInfomation {
  programName: string;
  programCode: string;
  parentDirectoryCode: string;
  slug: string;
}

export interface RoleInfomationLanguage {
  code: string;
  lang: string;
  name: string;
}

export interface CodeLang {
  code: string;
  lang: string;
  name: string;
}

export interface UserLoginParam {
  userName: string;
  password: string;
  lang: string;
}

export interface UserForLogged {
  id: string;
  name: string;
  email: string;
  account: string;
  roles: RoleInfomation[];
  roleAll: RoleInfomation[]
}

export interface UserForLoggedIn {
  id: string;
  username: string;
  email: string;
  permissions: string[];
  token: string;
  refreshToken: string;
}
