import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { UsuarioRespDTO } from 'src/app/model/response/user-respdto.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { passwordMatchValidator } from 'src/app/validators/validator-match-password';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePasswordForm!: FormGroup;
  userEdit!: UsuarioRespDTO;
  titleForm = 'Cambiar Contraseña';
  buttonText = 'Actualizar Contraseña';


  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly userService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
  }

  generateFormGroup() {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }
  onSubmit(): void { 

    console.log('Enviando formulario ...', this.changePasswordForm.value);
    if (this.changePasswordForm.valid) {
      const password = this.changePasswordForm.value.password;
      console.log('Contraseña a enviar:', password);
      this.userService.changePasswordUser(password, this.userEdit.id)
        .pipe(
          tap((response) => {
            console.log('response', response);
            alert('Contraseña actualizada correctamente');
            this.activeModal.close(true);
          }),
          catchError((error) => {
            console.error('Error al cambiar la contraseña', error);
            alert('Error al cambiar la contraseña');
            return of(null);
          })
        ).subscribe();
    }else {
      console.log('Formulario inválido');
      alert('Formulario inválido');
    }
  }
}
