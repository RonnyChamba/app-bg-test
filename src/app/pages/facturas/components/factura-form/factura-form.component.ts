import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap } from 'rxjs';
import { CustomerRespDTO } from 'src/app/model/customer.mode';
import { GenericResponse } from 'src/app/model/generic-response.model';
import { DetailsInvoiceReqDTO, InvoiceDetail, InvoiceFullRespDTO, PayFormRespDTO, SelectOption } from 'src/app/model/response/invoice.model';
import { UsuarioRespDTO } from 'src/app/model/response/user-respdto.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { HelperService } from 'src/app/services/helper.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SelectProductComponent } from '../select-product/select-product.component';
import { FacturaService } from 'src/app/services/factura.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-factura-form',
  templateUrl: './factura-form.component.html',
  styleUrls: ['./factura-form.component.css']
})
export class FacturaFormComponent {

  invoiceForm!: FormGroup;

  invoiceEdit!: InvoiceFullRespDTO;
  customers: CustomerRespDTO[] = [];
  users: SelectOption[] = [];
  payForms: PayFormRespDTO[] = [];
  payStatus: SelectOption[] = [
    { id: 1, description: 'Pagado' },
    { id: 2, description: 'Pendiente' }
  ];
  titleForm = 'Generar Factura';
  detaist: DetailsInvoiceReqDTO[] = [];
  subtotal: number = 0;
  porcentajeIva: number = 12;
  valorIva: number = 0;
  total: number = 0;
  constructor(
    public readonly activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly userService: UsuarioService,
    private readonly customerService: ClienteService,
    private readonly invoiceService: FacturaService,
    private readonly helperService: HelperService,
    private readonly companyService: CompanyService
    ,
  ) { }

  ngOnInit(): void {
    this.generateFormGroup();
    this.getCustomers();
    this.getUsers();
    this.getPayForms();
    this.disabledFields();
    this.subscribeToFormChanges();
    this.obtenerPorcentajeIva();
    if (this.invoiceEdit) {
      this.setInvoiceEdit(this.invoiceEdit);
    }
  }

  generateFormGroup() {
    this.invoiceForm = this.fb.group({
      createAt: [new Date().toISOString().substring(0, 10), Validators.required],
      statusPay: ['Pagado', Validators.required],
      porcentajeIva: [this.porcentajeIva, Validators.required],
      ivaValue: [0],
      subTotal: [0],
      total: [0],
      customerId: [null, Validators.required],
      telefono: [null, Validators.required],
      email: [null, Validators.required],
      userId: [null, Validators.required],
      invoicePayForm: this.fb.array([]),
      details: this.fb.array([])
    });
  }

  setInvoiceEdit(invoice: InvoiceFullRespDTO) {
    this.invoiceEdit = invoice;
    this.titleForm = 'Editar Factura';
    console.log('invoiceEdit', invoice);
    this.invoiceForm.patchValue({
      createAt: invoice.createAt,
      statusPay: invoice.statusPay,
      porcentajeIva: invoice.porcentajeIva,
      ivaValue: invoice.ivaValue,
      subTotal: invoice.subTotal,
      total: invoice.total,
      customerId: invoice.customerId,
      telefono: invoice.cellPhoneCustomer,
      email: invoice.emailCustomer,
      userId: invoice.userId
    });
    this.setPayFormEdit(invoice);

    // tiene qye llamarse antes de setDetails
    this.porcentajeIva = invoice.porcentajeIva;
    this.processDetails(invoice.details);

  }

  setPayFormEdit(invoice: InvoiceFullRespDTO) {

    console.log('asignado las formas de pago');
    invoice.invoicePayForm.forEach((payForm) => {
      this.invoicePayForm.push(this.fb.group({
        payFormId: [payForm.payFormId, Validators.required],
        description: [payForm.description],
        total: [payForm.total, Validators.required]
      }));
    }
    );
  }

  subscribeToFormChanges() {

    // Subscribe to changes in field customerId
    this.invoiceForm.get('customerId')?.valueChanges.subscribe((customerId) => {
      console.log('customerId', customerId);
      if (customerId) {


        // Get the customer data by id
        var customer = this.customers.find((customer) => customer.id == customerId);
        console.log('customer', customer);
        if (customer) {
          this.invoiceForm.patchValue({
            telefono: customer.cellPhone,
            email: customer.email
          });
        }
      }
    });

  }
  getCustomers(filter: string = ''): void {
    this.customerService.getClientes(filter)
      .pipe(
        tap((response: GenericResponse<CustomerRespDTO[]>) => {
          console.log('response', response);

          this.customers = response.data;
          // map the customers to SelectOption
          // this.customers = response.data.map((customer: CustomerRespDTO) => ({
          //   id: customer.id,
          //   description: `${customer.fullName}`,
          // }));
        }),
        catchError((error) => {
          console.error('Error fetching customers', error);
          alert('Error fetching customers');
          return of(null);
        }
        )
      ).subscribe();
  }

  getUsers(filter: string = ''): void {
    this.userService.getUsers(filter)
      .pipe(
        tap((response: GenericResponse<UsuarioRespDTO[]>) => {
          console.log('response', response);

          // map the customers to SelectOption
          this.users = response.data.map((customer: UsuarioRespDTO) => ({
            id: customer.id,
            description: `${customer.names} ${customer.lasName}`,
          }));
        }),
        catchError((error) => {
          console.error('Error fetching users', error);
          alert('Error fetching users');
          return of(null);
        }
        )
      ).subscribe();
  }

  getPayForms(): void {

    this.helperService.getPayForms()
      .pipe(
        tap((response: GenericResponse<PayFormRespDTO[]>) => {
          console.log('response', response);

          this.payForms = response.data;
          // // map the customers to SelectOption
          // this.payForms = response.data.map((customer: PayFormRespDTO) => ({
          //   id: customer.id,
          //   description: `${customer.description}`,
          // }));

          if (!this.invoiceEdit) {
            this.addFormaPago();
          }
        }),
        catchError((error) => {
          console.error('Error fetching pay forms', error);
          alert('Error fetching pay forms');
          return of(null);
        }
        )
      ).subscribe();
  }

  get invoicePayForm(): FormArray {
    return this.invoiceForm.get('invoicePayForm') as FormArray;
  }

  addFormaPago() {
    this.invoicePayForm.push(this.fb.group({
      payFormId: [null, Validators.required],
      description: [''],
      total: [0, Validators.required]
    }));
  }

  removeFormaPago(index: number) {
    this.invoicePayForm.removeAt(index);
  }
  disabledFields() {
    this.invoiceForm.get('ivaValue')?.disable();
    this.invoiceForm.get('subTotal')?.disable();
    this.invoiceForm.get('total')?.disable();
    this.invoiceForm.get('telefono')?.disable();
    this.invoiceForm.get('email')?.disable();
    this.invoiceForm.get('createAt')?.disable();
  }

  openModalProducts() {
    const modalRef = this.modalService.open(SelectProductComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.invoiceForm = this.invoiceForm;
    modalRef.result.then((result) => {
      console.log('Response modal:', result);
      this.processDetails(result);
    }).catch((error) => {
      console.log('Modal cerrado sin acción:', error);
    });
  }

  processDetails(productosSeleccionados: DetailsInvoiceReqDTO[]) {
    // productosSeleccionados: tiene los productos seleccionados 
    // detaist : tiene los productos que se van a agregar a la factura

    // se debe validar si el producto ya existe en la lista de detalles
    // si existe se debe sumar la cantidad y el total
    // si no existe se debe agregar el producto a la lista de detalles
    console.log('productosSeleccionados', productosSeleccionados);
    console.log('detaist', this.detaist);
    productosSeleccionados.forEach((productoSeleccionado) => {
      const index = this.detaist.findIndex((producto) => producto.productId === productoSeleccionado.productId);
      if (index !== -1) {
        // Si el producto ya existe, sumar la cantidad y el total
        this.detaist[index].amount += productoSeleccionado.amount;
        this.detaist[index].subtotal += productoSeleccionado.subtotal;
      } else {
        // Si no existe, agregar el producto a la lista de detalles
        this.detaist.push(productoSeleccionado);
      }
    });

    this.calculateTotals();

    // asignar el valor de los detalles al formulario

    this.setDetails(this.detaist);
    // console.log('detaist', this.invoiceForm);
  }


  removeProduct(index: number) {
    this.detaist.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.detaist.reduce((acc, p) => acc + p.subtotal, 0);
    this.valorIva = +(this.subtotal * this.porcentajeIva / 100).toFixed(2);
    this.total = +(this.subtotal + this.valorIva).toFixed(2);
  }

  get details(): FormArray {
    return this.invoiceForm.get('details') as FormArray;
  }

  private setDetails(data: any[]) {
    // limpia lo que hubiera
    this.details.clear();

    // por cada elemento, creas un FormGroup y lo agregas
    data.forEach(d => {
      this.details.push(this.fb.group({
        productId: [d.productId],
        description: [d.description],
        code: [d.code],
        price: [d.price],
        amount: [d.amount],
        subtotal: [d.subtotal]
      }));
    });
  }

  saveInvoice() {
    console.log('invoiceForm', this.invoiceForm);

    this.setDescriptionPayForm();
    if (this.invoiceForm.valid) {

      // valdar si hay detalles
      if (this.detaist.length === 0) {
        alert('No hay productos seleccionados');
        return;
      }

      // validar si hay forma de pago
      if (this.invoicePayForm.length === 0) {
        alert('No hay forma de pago seleccionada');
        return;
      }
      const invoice = this.invoiceForm.value;
      invoice.details = this.detaist;
      invoice.subTotal = this.subtotal;
      invoice.ivaValue = this.valorIva;
      invoice.total = this.total;
      invoice.createAt = this.formatDate(new Date());

      console.log('invoice', invoice);
      if (this.invoiceEdit) {
        this.updateNewInvoice(invoice, this.invoiceEdit.id);
      } else {
        this.generateNewInvoice(invoice);
      }


    } else {
      alert('Formulario inválido');
    }
  }

  generateNewInvoice(invoice: any) {
    this.invoiceService.saveInvoice(invoice)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('response', response);
          alert('Factura generada exitosamente');
          this.activeModal.close('OK');
        }),
        catchError((error) => {
          console.error('Error al generar la factura', error);
          alert('Error al generar la factura');
          this.activeModal.close('ERROR');
          return of(null);
        })
      ).subscribe();
  }

  updateNewInvoice(invoice: any, id: number) {
    this.invoiceService.updateInvoice(invoice, id)
      .pipe(
        tap((response: GenericResponse<string>) => {
          console.log('response', response);
          alert('Factura actualizar exitosamente');
          this.activeModal.close('OK');
        }),
        catchError((error) => {
          console.error('Error al actaualizar la factura', error);
          alert('Error al actualizar la factura');
          this.activeModal.close('ERROR');
          return of(null);
        })
      ).subscribe();
  }

  setDescriptionPayForm() {

    var invoicePayForm = this.invoiceForm.get('invoicePayForm')?.value;
    // console.log('invoicePayForm', invoicePayForm);

    invoicePayForm.forEach((payForm: any) => {
      var payFormSelected = this.payForms.find((payFormOption) => payFormOption.id == payForm.payFormId);
      console.log('payFormSelected', payFormSelected);
      if (payFormSelected) {
        payForm.description = payFormSelected.description;
      }
    });
    // console.log('invoicePayForm', invoicePayForm);
    this.invoiceForm.get('invoicePayForm')?.setValue(invoicePayForm);
  }


  private formatDate(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  obtenerPorcentajeIva() {
    this.companyService.getCompanyUserLogin()
      .pipe(
        tap((response: GenericResponse<any>) => {
          console.log('response', response);
          this.porcentajeIva = response.data.porcentajeIva;
          this.invoiceForm.patchValue({
            porcentajeIva: this.porcentajeIva
          });
        }),
        catchError((error) => {
          console.error('Error fetching company data', error);
          alert('Error fetching company data');
          return of(null);
        }
        )
      ).subscribe();
  }
}
