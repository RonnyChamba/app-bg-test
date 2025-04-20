import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioRespDTO } from '../model/response/user-respdto.model';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';
import { UsuarioReqDTO } from '../model/request/user-reqdto.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlMicro = environment.urlMicro;
  constructor(private readonly httpClient: HttpClient) {
  }

  getUsers(filter: string): Observable<GenericResponse<UsuarioRespDTO[]>> {
    return this.httpClient.get<GenericResponse<UsuarioRespDTO[]>>(`${this.urlMicro}/users?name=${filter}`);
  }

  saveUser(data: UsuarioReqDTO): Observable<GenericResponse<string>> {

    const request = {
      origin: 'AppAngular',
      payload: data
    };
    return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/users`, request);
  }

  updateUser(data: UsuarioReqDTO, id: number): Observable<GenericResponse<string>> {
  
      const request = {
        origin: 'AppAngular',
        payload: data
      };
      return this.httpClient.patch<GenericResponse<string>>(`${this.urlMicro}/users/${id}`, request);
    }

  deleteUser(id: number): Observable<GenericResponse<string>> { 
    return this.httpClient.delete<GenericResponse<string>>(`${this.urlMicro}/users/${id}`);
  }
}
