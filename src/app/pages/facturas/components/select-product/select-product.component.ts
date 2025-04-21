import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { DetailsInvoiceReqDTO } from 'src/app/model/response/invoice.model';
import { ProductItemSelected, ProductRespDTO } from 'src/app/model/response/product-respdto.mode';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent {

  products: ProductItemSelected[] = [];

  detaist: DetailsInvoiceReqDTO[] = [];

    constructor(private readonly productService: ProductoService ,
          private readonly modalService: NgbModal,
          public readonly activeModal: NgbActiveModal,
      
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
            // asignarle a la propiedad selectedAmount el valor 1 minimo
            this.products.forEach((product) => {
              product.selectedAmount = 1;
            });

          }),
          catchError((error) => {
            console.error('Error fetching products', error);
            return of(null);
          }
          )
        ).subscribe();
    }
    onClickAddProduct(producto: ProductItemSelected): void {

      console.log('product', producto);

      const cantidad = producto.selectedAmount || 1;
      const subtotal = cantidad * producto.price;
    
      const detalle : DetailsInvoiceReqDTO = {
        productId: producto.id,
        description: producto.description,
        code: producto.code,
        price: producto.price,
        amount: cantidad,
        subtotal: subtotal
      };

      this.detaist.push(detalle);
    }

    closeModal() {
      this.activeModal.close(this.detaist);
    }
}
