import { Injectable } from '@angular/core';
import { JwtPayload } from '../model/jwtpayload .model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  private tokenKey = 'tokenTest';

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadDecoded = atob(payloadBase64);
      return JSON.parse(payloadDecoded);
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

   getUsername(): string | null {
    return this.decodeToken()?.name ?? null;
  }

  getRole(): string | null {
    return this.decodeToken()?.role ?? null;
  }

  getCompanyId(): string | null {
    return this.decodeToken()?.companyId ?? null;
  }

}
