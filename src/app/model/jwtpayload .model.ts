export interface JwtPayload {
    name: string;
    nameid: string;
    role: string;
    companyId?: string;
    exp: number;
    iss: string;
    aud: string;
    [key: string]: any;
  }