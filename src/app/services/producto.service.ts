import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductRespDTO } from '../model/response/product-respdto.mode';
import { GenericResponse } from '../model/generic-response.model';
import { Observable } from 'rxjs';

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
}
