import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ProductRespDTO } from 'src/app/model/response/product-respdto.mode';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent {

   products: ProductRespDTO[] = [];
   
    constructor(private readonly productService: ProductoService
    ) { }

    ngOnInit(): void {
      this.getProducts();
    
    }

     getProducts(filter: string = ''): void {
        this.productService.getProducts(filter)
          .pipe(
            tap((response: GenericResponse<ProductRespDTO[]>) => {
              console.log('response', response);
              this.products = response.data;
            }),
            catchError((error) => {
              console.error('Error fetching products', error);
              return of(null);
            }
            )
          ).subscribe();
      }
}
