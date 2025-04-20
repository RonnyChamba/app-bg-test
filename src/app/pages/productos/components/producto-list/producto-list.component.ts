import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ProductRespDTO } from 'src/app/model/response/product-respdto.mode';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent {

  products: ProductRespDTO[] = [];
  searchControl = new FormControl('');
  constructor(private readonly productService: ProductoService,
        private readonly modalService: NgbModal
    
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.applyFilter();
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

  applyFilter(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // espera 300ms después de dejar de escribir
        distinctUntilChanged() // solo si cambia el valor
      )
      .subscribe(value => {
        const input = value?.trim() ?? '';

        if (input.length === 0) {
          this.getProducts();
        } else if (input.length >= 3) {
          this.getProducts(input);
        }
      });
  }

  reloadTable(): void {
    this.getProducts();
  }

    onClickOpenModalEdit(productRespDTO: ProductRespDTO) {
      const modalRef = this.modalService.open(ProductoFormComponent, { centered: true, size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.productEdit = productRespDTO;
      modalRef.result.then((result) => {
        if (result === 'OK') {
          this.getProducts();
        }
      }).catch((error) => {
        console.log('Modal cerrado sin acción:', error);
      });
    }
  onClickDelete(productRespDTO: ProductRespDTO) {

    if (confirm(`¿Está seguro de eliminar el producto ${productRespDTO.description}?`)) {
      this.productService.deleteProduct(productRespDTO.id)
        .pipe(
          tap((response: GenericResponse<string>) => {
            console.log('Response:', response);
            alert('Producto eliminado exitosamente');
            this.getProducts();
          }),
          catchError((error) => {
            console.error('Error al eliminar el producto', error);
            alert('Error al eliminar el producto');
            return of(null);
          })
        ).subscribe();
    }
  }
}
