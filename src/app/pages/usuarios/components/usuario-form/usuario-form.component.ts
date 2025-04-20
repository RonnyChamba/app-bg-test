import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { UsuarioReqDTO } from 'src/app/model/request/user-reqdto.model';
import { UsuarioRespDTO } from 'src/app/model/response/user-respdto.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { passwordMatchValidator } from 'src/app/validators/validator-match-password';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {

  customerForm!: FormGroup;
  userEdit!: UsuarioRespDTO;
  titleForm = 'Registrar Usuario';
  buttonText = 'Registrar';

  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly userService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.setEditUser(this.userEdit);
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
    }, { validators: passwordMatchValidator });
  }

  setEditUser(userRespDTO: UsuarioRespDTO): void {
    if (!userRespDTO) {
      return;
    }
    this.titleForm = 'Editar Usuario';
    this.buttonText = 'Actualizar';

    this.customerForm.patchValue({
      names: userRespDTO.names,
      lasName: userRespDTO.lasName,
      email: userRespDTO.email,
      username: userRespDTO.username
    }, { emitEvent: false });

    // disable the username field
    this.customerForm.get('username')?.disable();

    // hiden the password and repeatPassword fields
    this.customerForm.get('password')?.setValue('********');
    this.customerForm.get('repeatPassword')?.setValue('********');
    this.customerForm.get('password')?.disable();
    this.customerForm.get('repeatPassword')?.disable();
  }

  saveUser(): void {
    console.log('Enviando formulario ...', this.customerForm.value);
    if (this.customerForm.valid) {
      const customer: UsuarioReqDTO = this.customerForm.value;
      console.log('Usuario a enviar:', customer);

      if (this.userEdit) {
        this.updateUser(customer, this.userEdit.id);
      } else {
        this.registerUser(customer);
      }
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

  updateUser(customer: UsuarioReqDTO, id: number): void {

    this.userService.updateUser(customer, id)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('Response:', response);
          this.customerForm.reset();
          this.activeModal.close("OK");
          alert('Usuario actualizado exitosamente');
        }),
        catchError((error) => {
          console.error('Error al actualizar el usuario', error);
          alert('Error al actualizar el usuario');
          this.customerForm.reset();
          this.activeModal.close("ERROR");
          return of(null);
        })
      ).subscribe();
  }

}
