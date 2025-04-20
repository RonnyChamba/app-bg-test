import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LoginDTO } from '../model/login.dto';
import { GenericResponse } from '../model/generic-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlMicro = environment.urlMicro;

  constructor(private readonly httpClient: HttpClient) {
  }
  login(loginDTO: LoginDTO): Observable<GenericResponse<string>> { 

    let  request = {
      origin: 'AppAngular',
      payload: loginDTO
    }
    console.log('request', request);
    return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/auth/login`, request);
  }

}
