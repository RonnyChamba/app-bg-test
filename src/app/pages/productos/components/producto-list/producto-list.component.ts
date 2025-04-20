import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
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
  searchControl = new FormControl('');
  constructor(private readonly productService: ProductoService
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
}
