import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ProductReqDTO } from 'src/app/model/request/product-reqdto.model';
import { ProductRespDTO } from 'src/app/model/response/product-respdto.mode';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent {

  productForm!: FormGroup;
  productEdit!: ProductRespDTO;
  titleForm = 'Registrar Producto';
  buttonText = 'Registrar';

  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly productoService: ProductoService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.setEditProduct(this.productEdit);
  }

  generateFormGroup() {

    this.productForm = this.fb.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  setEditProduct(productRespDTO: ProductRespDTO): void {
    if (!productRespDTO) {
      return;
    }
    this.titleForm = 'Editar Producto';
    this.buttonText = 'Actualizar';
    this.productForm.patchValue({
      code: productRespDTO.code,
      description: productRespDTO.description,
      price: productRespDTO.price
    }, { emitEvent: false });

  }
  saveProduct(): void {
    console.log('Enviando formulario ...', this.productForm.value);
    if (this.productForm.valid) {
      const productReqDTO: ProductReqDTO = this.productForm.value;
      console.log('Product a enviar:', productReqDTO);
      
      if (this.productEdit) {
        this.updateProduct(productReqDTO, this.productEdit.id);
      } else {
        this.registerProduct(productReqDTO);
      }
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

  updateProduct(userReqDTO: ProductReqDTO, id: number): void {

    this.productoService.updateProduct(userReqDTO, id)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.productForm.reset();
          this.activeModal.close("OK");
          alert('Producto actualizado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al actualizar el producto', error);
          alert('Error al actualizar el producto');
          this.productForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();
  }
}
