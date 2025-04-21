import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { InvoiceFilterType, InvoiceFullRespDTO, InvoiceRespDTO } from 'src/app/model/response/invoice.model';
import { FacturaService } from 'src/app/services/factura.service';
import { FacturaFormComponent } from '../factura-form/factura-form.component';

@Component({
  selector: 'app-factura-list',
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.css']
})
export class FacturaListComponent {

  filterForm!: FormGroup;
  invoiceFilterType: InvoiceFilterType[] = [
    { id: 'CustomerName', description: 'Nombre Cliente' },
    { id: 'InvoiceNumber', description: 'Numero Factura' },
    { id: 'InvoiceTotal', description: 'Total Factura' }
  ];

  comparisonOperatorEnum: InvoiceFilterType[] = [
    { id: 'LessThan', description: 'Menor que' },
    { id: 'LessThanOrEqual', description: 'Menor igual que' },
    { id: 'EqualTo', description: 'Igual' },
    { id: 'GreaterThan', description: 'Mayor que' },
    { id: 'GreaterThanOrEqual', description: 'Mayor igual que' }
  ];

  customers: InvoiceRespDTO[] = [];
  isShowOperatorFilter = false;
  constructor(private readonly invoiceService: FacturaService,
    private readonly modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.getInvoices();
    this.onChangeFilterType();

  }

  generateFormGroup() {
    this.filterForm = this.fb.group({
      filterType: [null],
      operator: [null],
      searchText: ['']
    });
  }

  onChangeFilterType(): void {
    this.filterForm.get('filterType')?.valueChanges.subscribe((selectedValue: string) => {
      console.log('Selected filter type:', selectedValue);
      this.isShowOperatorFilter = selectedValue === 'InvoiceTotal';
      if (this.isShowOperatorFilter) {
        this.filterForm.get('operator')?.setValue(null);
      } else {
        this.filterForm.get('operator')?.setValue(null);
      }
    }
    );
  }


  getInvoices(params?: any): void {
    this.invoiceService.getInvoices(params)
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

  onClickDeleteInvoice(invoiceResp: InvoiceRespDTO): void {

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

  onClickPdfInvoice(invoiceResp: InvoiceRespDTO): void {

    this.invoiceService.getPdf(invoiceResp.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');      // abrir en nueva pestaña
      },
      error: err => {
        console.error('Error al cargar PDF', err);
      }
    });

  }

  onSearch(): void {
    const params = this.filterForm.value;
    console.log('Buscar con:', params);
    this.getInvoices(params);
  }

  onClickEditarInvoice(invoiceResp: InvoiceRespDTO): void {

    console.log('Editar invoice', invoiceResp);
    this.invoiceService.getInvoice(invoiceResp.id)
      .pipe(
        tap((response: GenericResponse<InvoiceFullRespDTO>) => {
          console.log('response', response);
          this.openModalEditInvoice(response.data);
        }),
        catchError((error) => {
          console.error('Error obtener invoice', error);
          return of(null);
        }
        )
      ).subscribe();
  }

  openModalEditInvoice(invoiceData: InvoiceFullRespDTO): void {
    const modalRef = this.modalService.open(FacturaFormComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.invoiceEdit = invoiceData;

    modalRef.result.then((result) => {
      if (result === 'OK') {
        this.getInvoices();
      }
    }).catch((error) => {
      console.log('Modal cerrado sin acción:', error);
    });
  }


}
