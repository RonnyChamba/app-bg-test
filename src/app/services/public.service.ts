import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanyReqDTO } from '../model/request/user-reqdto.model';
import { Observable } from 'rxjs';
import { GenericResponse } from '../model/generic-response.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private urlMicro = environment.urlMicro;
  constructor(private readonly httpClient: HttpClient) {
  }

    saveCompany(data: CompanyReqDTO): Observable<GenericResponse<string>> {
  
      const request = {
        origin: 'AppAngular',
        payload: data
      };
      return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/public/register-company`, request);
    }
  
}
