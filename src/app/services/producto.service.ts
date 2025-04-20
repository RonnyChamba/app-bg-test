import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductRespDTO } from '../model/response/product-respdto.mode';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';
import { ProductReqDTO } from '../model/request/product-reqdto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlMicro = environment.urlMicro;
  constructor(private readonly httpClient: HttpClient) {
  }

  getProducts(filter: string): Observable<GenericResponse<ProductRespDTO[]>> {
    return this.httpClient.get<GenericResponse<ProductRespDTO[]>>(`${this.urlMicro}/products?paramFilter=${filter}`);
  }


  saveProduct(data: ProductReqDTO): Observable<GenericResponse<string>> {
    const request = {
      origin: 'AppAngular',
      payload: data
    };
    return this.httpClient.post<GenericResponse<string>>(`${this.urlMicro}/products`, request);
  }

  deleteProduct(id: number): Observable<GenericResponse<string>> {
    return this.httpClient.delete<GenericResponse<string>>(`${this.urlMicro}/products/${id}`);
  }
}
