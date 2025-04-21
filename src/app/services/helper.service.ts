import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PayFormRespDTO } from '../model/response/invoice.model';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private urlMicro = environment.urlMicro;
    constructor(private readonly httpClient: HttpClient) {
    }
  
    getPayForms(): Observable<GenericResponse<PayFormRespDTO[]>> {
      return this.httpClient.get<GenericResponse<PayFormRespDTO[]>>(`${this.urlMicro}/helpers/getting-pay-forms`);
    }
}
