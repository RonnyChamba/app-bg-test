import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { UsuarioRespDTO } from 'src/app/model/response/user-respdto.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent {

  customers: UsuarioRespDTO[] = [];

  constructor(private readonly userService: UsuarioService) { }
  ngOnInit(): void { 
    this.getUsers();
  }


  getUsers(filter: string = ''): void {
    this.userService.getUsers(filter)
      .pipe(
        tap((response: GenericResponse<UsuarioRespDTO[]>) => {
          console.log('response', response);
          this.customers = response.data;
        }),
        catchError((error) => {
          console.error('Error fetching customers', error);
          return of(null);
        }
        )
      ).subscribe();
  }

}
