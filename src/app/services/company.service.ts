import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanyRespDTO } from '../model/response/company-respdto.model';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';
import { CompanyReqDTO, CompanySimpleReqDTO } from '../model/request/user-reqdto.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

   private urlMicro = environment.urlMicro;
      constructor(private readonly httpClient: HttpClient) {
      }
    
      getCompanyUserLogin(): Observable<GenericResponse<CompanyRespDTO>> {
        return this.httpClient.get<GenericResponse<CompanyRespDTO>>(`${this.urlMicro}/companies`);
      }


        updateCompany(data: CompanySimpleReqDTO, id: number): Observable<GenericResponse<string>> {
      
          const request = {
            origin: 'AppAngular',
            payload: data
          };
          return this.httpClient.put<GenericResponse<string>>(`${this.urlMicro}/companies/${id}`, request);
        }
}
