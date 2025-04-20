import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { UsuarioReqDTO } from 'src/app/model/request/user-reqdto.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { passwordMatchValidator } from 'src/app/validators/validator-match-password';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {

  customerForm!: FormGroup;
  titleForm = 'Registrar Usuario';
  buttonText = 'Registrar';

  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly userService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
  }
  generateFormGroup() {

    this.customerForm = this.fb.group({
      names: ['', [Validators.required]],
      lasName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['USER', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    }, {validators: passwordMatchValidator});
  }

  saveUser(): void {
    console.log('Enviando formulario ...', this.customerForm.value);
    if (this.customerForm.valid) {
      const customer: UsuarioReqDTO = this.customerForm.value;
      console.log('Usuario a enviar:', customer);
      this.registerUser(customer);
    }

  }

  registerUser(userReqDTO: UsuarioReqDTO): void {

    this.userService.saveUser(userReqDTO)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.customerForm.reset();
          this.activeModal.close("OK");
          alert('Usuario registrado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al registrar el usuario', error);
          alert('Error al registrar el usuario');
          this.customerForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();

  }

}
