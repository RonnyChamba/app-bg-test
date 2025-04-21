import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';
import { InvoiceRespDTO } from '../model/response/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlMicro = environment.urlMicro;
  constructor(private readonly httpClient: HttpClient) {
  }

  getInvoices(filter: string): Observable<GenericResponse<InvoiceRespDTO[]>> {
    return this.httpClient.get<GenericResponse<InvoiceRespDTO[]>>(`${this.urlMicro}/invoices?name=${filter}`);
  }

   saveInvoice(data: any): Observable<GenericResponse<string>> {
  
      const request = {
        origin: 'AppAngular',
        payload: data
      };
      return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/invoices`, request);
    }

    deleteInvoice(id: number): Observable<GenericResponse<string>> {
      return this.httpClient.delete<GenericResponse<string>>(`${this.urlMicro}/invoices/${id}`);
    }

    getPdf(id: number): Observable<Blob> {
      return this.httpClient.get(
        `${this.urlMicro}/invoices/${id}/report-pdf`,
        { responseType: 'blob' }
      );
    }
  
}
