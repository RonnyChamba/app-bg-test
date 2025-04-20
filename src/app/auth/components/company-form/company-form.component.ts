import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CompanyReqDTO } from 'src/app/model/request/user-reqdto.model';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent {

  customerForm!: FormGroup;
  titleForm = 'Registrar Empresa';
  buttonText = 'Registrar';


  constructor(private fb: FormBuilder,
    private readonly publicService: PublicService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
  }

  generateFormGroup() {
    this.customerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      porcentajeIva: [12, [Validators.required, Validators.min(0)]],
      city: ['', [Validators.required]],
      userReqDTO: this.fb.group({
        names: ['', [Validators.required]],
        lasName: ['', [Validators.required]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        rol: ['ADMI', [Validators.required]]
      })
    });
  }

  saveUser(): void {
    console.log('Enviando formulario ...', this.customerForm.value);
    if (this.customerForm.valid) {
      const customer: CompanyReqDTO = this.customerForm.value;
      console.log('Usuario a enviar:', customer);
      this.publicService.saveCompany(customer).pipe(
        tap((response: any) => {
          console.log('Respuesta del servidor:', response);

          alert('Empresa registrada correctamente');
          this.router.navigate(['/login']); 
        }),
        catchError((error) => {
          console.error('Error al registrar la empresa:', error);
          alert('Error al registrar la empresa');
          this.router.navigate(['/login']);
          return of(null);
        })
      ).subscribe();
    }

  }

}
