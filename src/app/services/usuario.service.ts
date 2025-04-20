import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioRespDTO } from '../model/response/user-respdto.model';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';

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
}
