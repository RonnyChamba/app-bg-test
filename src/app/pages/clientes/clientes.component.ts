import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { CustomerRespDTO } from 'src/app/model/customer.mode';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  customers: CustomerRespDTO[] = [];
  constructor(private readonly customerService: ClienteService) { }
  ngOnInit(): void {
    this.getClientes();
  }
  getClientes(filter: string = ''): void {
    this.customerService.getClientes(filter)
    .pipe(
      tap((response: GenericResponse<CustomerRespDTO[]>) => {
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
