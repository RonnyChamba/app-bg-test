import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ProductReqDTO } from 'src/app/model/request/product-reqdto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent {

  productForm!: FormGroup;
  titleForm = 'Registrar Producto';
  buttonText = 'Registrar';

  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly productoService: ProductoService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
  }

  generateFormGroup() {

    this.productForm = this.fb.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  saveProduct(): void {
    console.log('Enviando formulario ...', this.productForm.value);
    if (this.productForm.valid) {
      const productReqDTO: ProductReqDTO = this.productForm.value;
      console.log('Product a enviar:', productReqDTO);
      this.registerProduct(productReqDTO);
    }else {
      alert('Formulario inválido');
    }
  }

  registerProduct(userReqDTO: ProductReqDTO): void {

    this.productoService.saveProduct(userReqDTO)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.productForm.reset();
          this.activeModal.close("OK");
          alert('Producto registrado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al registrar el producto', error);
          alert('Error al registrar el producto');
          this.productForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();

  }
}
