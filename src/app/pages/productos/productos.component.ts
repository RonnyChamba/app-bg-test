import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoFormComponent } from './components/producto-form/producto-form.component';
import { ProductoListComponent } from './components/producto-list/producto-list.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {

  @ViewChild(ProductoListComponent)
  productListComponent!: ProductoListComponent;
  
  constructor(private readonly modalService: NgbModal
  ) { }

  async onClikOpenModalCreate() {
    console.log('onClikOpenModalCreate');
    const modalRef = this.modalService.open(ProductoFormComponent, { centered: true, size: 'lg', backdrop: 'static' });
    try {
      const result = await modalRef.result;
      console.log('Response modal:', result);
      if (result === 'OK') {
        this.productListComponent.reloadTable();
      }
    } catch (error) {
      console.log('Modal cerrado sin acción:', error);
    }

  }
}
