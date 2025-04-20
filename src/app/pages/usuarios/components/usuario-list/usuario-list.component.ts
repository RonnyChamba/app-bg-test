import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { UsuarioRespDTO } from 'src/app/model/response/user-respdto.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent {

  customers: UsuarioRespDTO[] = [];
  searchControl = new FormControl('');
  constructor(private readonly userService: UsuarioService,
    private readonly modalService: NgbModal
  ) { }
  ngOnInit(): void {
    this.getUsers();
    this.applyFilter();
  }
  getUsers(filter: string = ''): void {
    this.userService.getUsers(filter)
      .pipe(
        tap((response: GenericResponse<UsuarioRespDTO[]>) => {
          console.log('response', response);
          this.customers = response.data;
        }),
        catchError((error) => {
          console.error('Error fetching users', error);
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
          this.getUsers();
        } else if (input.length >= 3) {
          this.getUsers(input);
        }
      });
  }

  reloadTable(): void {
    this.getUsers();
  }

  onClickDelete(customer: UsuarioRespDTO) {
  
      // console.log('onClickDelete', customer);
      if (confirm(`¿Está seguro de eliminar al usuario ${customer.names} ${customer.lasName}?`)) {
        this.userService.deleteUser(customer.id)
          .pipe(
            tap((response: GenericResponse<string>) => {
              console.log('Response:', response);
              alert('Usuario eliminado exitosamente');
              this.getUsers();
            }),
            catchError((error) => {
              console.error('Error al eliminar el usuario', error);
              alert('Error al eliminar el usuario');
              return of(null);
            })
          ).subscribe();
      }
    }

    onClickOpenModalEdit(customer: UsuarioRespDTO) {
        // console.log('onClickOpenModalEdit', customer);
        const modalRef = this.modalService.open(UsuarioFormComponent, { centered: true, size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.userEdit = customer;
        modalRef.result.then((result) => {
          if (result === 'OK') {
            this.getUsers();
          }
        }).catch((error) => {
          console.log('Modal cerrado sin acción:', error);
        });
      }

}
