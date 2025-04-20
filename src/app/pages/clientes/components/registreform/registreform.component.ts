import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { CustomerRespDTO } from 'src/app/model/customer.mode';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { CustomerReqDTO } from 'src/app/model/request/custome-reqdto.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-registreform',
  templateUrl: './registreform.component.html',
  styleUrls: ['./registreform.component.css']
})
export class RegistreformComponent {

  customerForm!: FormGroup;
  customerEdit!: CustomerRespDTO;
  titleForm = 'Registrar Cliente';
  buttonText = 'Registrar';

  constructor(private fb: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly customerService: ClienteService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.setEditCustomer(this.customerEdit);
    console.log('customer edit', this.customerEdit);
  }

  generateFormGroup() {
    this.customerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      cellPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
  }

  setEditCustomer(customer: CustomerRespDTO): void {
    if (!customer) {
      return;
    }
    this.titleForm = 'Editar Cliente';
    this.buttonText = 'Actualizar';
    this.customerForm.patchValue({
      fullName: customer.fullName,
      cellPhone: customer.cellPhone,
      email: customer.email,
      address: customer.address
    }, { emitEvent: false });
  }

  saveCustomer(): void {
    console.log('Enviando formulario ...', this.customerForm.value);
    if (this.customerForm.valid) {
      const customer: CustomerReqDTO = this.customerForm.value;
      console.log('Cliente a enviar:', customer);

      if (this.customerEdit) {
        this.updateCustomer(customer, this.customerEdit.id);  
      } else {
        this.registerCustomer(customer);
      }
    }

  }

  registerCustomer(customer: CustomerReqDTO): void {

    this.customerService.saveCustomer(customer)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.customerForm.reset();
          this.activeModal.close("OK");
          alert('Cliente registrado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al registrar el cliente', error);
          alert('Error al registrar el cliente');
          this.customerForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();
  }
  updateCustomer(customer: CustomerReqDTO, id: number): void { 

    
    this.customerService.updateCustomer(customer, id)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.customerForm.reset();
          this.activeModal.close("OK");
          alert('Cliente actualizado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al actualizar el cliente', error);
          alert('Error al actualizar el cliente');
          this.customerForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();
  }


}
