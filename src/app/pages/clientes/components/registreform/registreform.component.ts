import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
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

  constructor(private fb: FormBuilder,
    public readonly activeModal: NgbActiveModal,
    private readonly customerService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.generateFormGroup();
  }

  generateFormGroup() {
    this.customerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      cellPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
  }

  saveCustomer(): void {
    console.log('Enviando formulario ...', this.customerForm.value);
    if (this.customerForm.valid) {
      const customer: CustomerReqDTO = this.customerForm.value;
      console.log('Cliente a enviar:', customer);
    
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
    } else {
      this.customerForm.markAllAsTouched();
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
}
