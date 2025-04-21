import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { InvoiceRespDTO } from 'src/app/model/response/invoice.model';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-factura-list',
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.css']
})
export class FacturaListComponent {

  customers: InvoiceRespDTO[] = [];
  constructor(private readonly invoiceService: FacturaService,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getInvoices();
  }


  getInvoices(filter: string = ''): void {
    this.invoiceService.getInvoices(filter)
      .pipe(
        tap((response: GenericResponse<InvoiceRespDTO[]>) => {
          console.log('response', response);
          this.customers = response.data;
        }),
        catchError((error) => {
          console.error('Error fetching invoices', error);
          return of(null);
        }
        )
      ).subscribe();
  }

  reloadTable(): void {
    this.getInvoices();
  }

  onClickDeleteInvoice(invoiceResp : InvoiceRespDTO): void {

    if (confirm(`¿Está seguro de eliminar la factura # ${invoiceResp.invoiceNumber}?`)) {
      this.invoiceService.deleteInvoice(invoiceResp.id)
        .pipe(
          tap((response: GenericResponse<string>) => {
            console.log('response', response);
            alert(`Factura # ${invoiceResp.invoiceNumber} eliminada correctamente`);
            this.getInvoices();
          }),
          catchError((error) => {
            console.error('Error deleting invoice', error);
            alert(`Error eliminando la factura # ${invoiceResp.invoiceNumber}`);
            return of(null);
          }
          )
        ).subscribe();
    }
  }


}
