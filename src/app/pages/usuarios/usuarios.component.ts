import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  @ViewChild(UsuarioListComponent)
  usuarioListComponent!: UsuarioListComponent;
  
  constructor(private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void { }

  async onClikOpenModalCreate() {
    console.log('onClikOpenModalCreate');
    const modalRef = this.modalService.open(UsuarioFormComponent, { centered: true, size: 'lg', backdrop: 'static' });
    try {
      const result = await modalRef.result;
      console.log('Response modal:', result);
      if (result === 'OK') {
        this.usuarioListComponent.reloadTable();
      }
    } catch (error) {
      console.log('Modal cerrado sin acción:', error);
    }

  }
}
