import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/services/cliente.service';
import { RegistreformComponent } from './components/registreform/registreform.component';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {


  @ViewChild(ClientesListComponent)
  clientesListComponent!: ClientesListComponent;
  constructor(private readonly customerService: ClienteService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {

  }

  async onClikOpenModalCreate() {
    console.log('onClikOpenModalCreate');
    const modalRef = this.modalService.open(RegistreformComponent, { centered: true, size: 'lg', backdrop: 'static' });
    try {
      const result = await modalRef.result;
      console.log('Response modal:', result);
      if (result === 'OK') {

        this.clientesListComponent.reloadTable();
      }
    } catch (error) {
      console.log('Modal cerrado sin acción:', error);
    }

  }

}
