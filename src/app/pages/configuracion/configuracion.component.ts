import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { CompanySimpleReqDTO } from 'src/app/model/request/user-reqdto.model';
import { CompanyService } from 'src/app/services/company.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {

  customerForm!: FormGroup;
  titleForm = 'Registrar Usuario';
  buttonText = 'Actualizar Datos';
  constructor(
    private fb: FormBuilder,
    private readonly companyService: CompanyService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.setDataCompany();
  }

  generateFormGroup() {

    this.customerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      id: [0, [Validators.required]],
      porcentajeIva: [12, [Validators.required]],
      city: ['', [Validators.required]]
    });
  }
  updateData() { 

    var id = this.customerForm.get('id')?.value;
    var body = this.customerForm.value as CompanySimpleReqDTO;
    this.companyService.updateCompany(body, id)
    .pipe(
      tap((resp) => {
        alert('Datos actualizados correctamente');
      }),
      catchError((err) => {
        alert('Error al actualizar los datos');
        return of(err);
      })
    ).subscribe();
  }


  setDataCompany(): void {
    this.companyService.getCompanyUserLogin().subscribe({
      next: (resp) => {
       console.log(resp);
          this.customerForm.patchValue({
            fullName: resp.data.fullName,
            city: resp.data.city,
            id: resp.data.id,
            porcentajeIva: resp.data.porcentajeIva
          }, { emitEvent: false });
        
      },
      error: (err) => {
        console.log(err);
        alert('Error al cargar los datos de la empresa');
      }
    });
  }



}
