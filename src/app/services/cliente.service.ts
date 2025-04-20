import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericResponse } from '../model/generic-response.model';
import { CustomerRespDTO } from '../model/customer.mode';
import { CustomerReqDTO } from '../model/request/custome-reqdto.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlMicro = environment.urlMicro;
   constructor(private readonly httpClient: HttpClient) {
    }


  getClientes(filter: string): Observable<GenericResponse<CustomerRespDTO[]>> {
    return this.httpClient.get<GenericResponse<CustomerRespDTO[]>>(`${this.urlMicro}/customers?name=${filter}`);
  }

  
  saveCustomer(data: CustomerReqDTO): Observable<GenericResponse<string>> {

    const request = {
      origin: 'AppAngular',
      payload: data
    };
    return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/customers`, request);
  }
}
