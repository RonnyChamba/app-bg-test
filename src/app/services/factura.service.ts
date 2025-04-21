import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';
import { InvoiceFullRespDTO, InvoiceRespDTO } from '../model/response/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlMicro = environment.urlMicro;
  constructor(private readonly httpClient: HttpClient) {
  }

  getInvoices(params: any): Observable<GenericResponse<InvoiceRespDTO[]>> {


    // example  params ?valueFilter=0000000002&invoiceFilterType=InvoiceNumber&comparisonOperator=EqualTo

    const filter = params?.searchText ? params.searchText : '';
    const invoiceFilterType = params?.filterType ? params.filterType : '';
    const comparisonOperator = params?.operator ? params.operator : '';
    const url = `${this.urlMicro}/invoices?valueFilter=${filter}&invoiceFilterType=${invoiceFilterType}&comparisonOperator=${comparisonOperator}`;


    return this.httpClient.get<GenericResponse<InvoiceRespDTO[]>>(url);
  }


  getInvoice(id: number): Observable<GenericResponse<InvoiceFullRespDTO>> {
    return this.httpClient.get<GenericResponse<InvoiceFullRespDTO>>(`${this.urlMicro}/invoices/${id}`);
  }

  saveInvoice(data: any): Observable<GenericResponse<string>> {

    const request = {
      origin: 'AppAngular',
      payload: data
    };
    return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/invoices`, request);
  }

  updateInvoice(data: any, id: number): Observable<GenericResponse<string>> {

    const request = {
      origin: 'AppAngular',
      payload: data
    };
    return this.httpClient.put<GenericResponse<string>>(`${this.urlMicro}/invoices/${id}`, request);
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
