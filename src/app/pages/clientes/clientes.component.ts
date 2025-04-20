import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, filter, of, tap } from 'rxjs';
import { CustomerRespDTO } from 'src/app/model/customer.mode';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { RegistreformComponent } from './components/registreform/registreform.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  customers: CustomerRespDTO[] = [];
  searchControl = new FormControl('');
  constructor(private readonly customerService: ClienteService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getCustomers();
    this.applyFilter();
  }

  getCustomers(filter: string = ''): void {
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

  applyFilter(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // espera 300ms después de dejar de escribir
        distinctUntilChanged() // solo si cambia el valor
      )
      .subscribe(value => {
        const input = value?.trim() ?? '';

        if (input.length === 0) {
          this.getCustomers();
        } else if (input.length >= 3) {
          this.getCustomers(input);
        }
      });
  }

  async onClikOpenModalCreate() {
    console.log('onClikOpenModalCreate');
    const modalRef = this.modalService.open(RegistreformComponent, { centered: true, size: 'lg', backdrop: 'static' });
    try {
      const result = await modalRef.result;
      console.log('Response modal:', result);
      if (result === 'OK') {
        this.getCustomers();
      } 
    }catch (error) {
      console.log('Modal cerrado sin acción:', error);
    }
  
  }

  onClickDelete(customer: CustomerRespDTO): void {

    console.log('onClickDelete', customer);
    if (confirm(`¿Está seguro de eliminar al cliente ${customer.fullName}?`)) {
      this.customerService.deleteCustomer(customer.id)
        .pipe(
          tap((response: GenericResponse<string>) => {
            console.log('Response:', response);
            alert('Cliente eliminado exitosamente');
            this.getCustomers();
          }),
          catchError((error) => {
            console.error('Error al eliminar el cliente', error);
            alert('Error al eliminar el cliente');
            return of(null);
          })
        ).subscribe();
    }
  }


}
