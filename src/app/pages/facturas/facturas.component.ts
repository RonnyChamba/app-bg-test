import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FacturaFormComponent } from './components/factura-form/factura-form.component';
import { FacturaListComponent } from './components/factura-list/factura-list.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent {


  @ViewChild(FacturaListComponent)
  facturaListComponent!: FacturaListComponent;
  constructor(private readonly modalService: NgbModal
  ) { }

  async onClikOpenModalFactura() {
    console.log('onClikOpenModalCreate');
    const modalRef = this.modalService.open(FacturaFormComponent, { centered: true, size: 'xl', backdrop: 'static' });
    try {
      const result = await modalRef.result;
      console.log('Response modal:', result);
      if (result === 'OK') {
        this.facturaListComponent.reloadTable();
      }
    } catch (error) {
      console.log('Modal cerrado sin acción:', error);
    }

  }
}
