export interface InvoiceRespDTO {
    id: number;
    invoiceNumber: string;
    fullNameCustomer: string;
    fullNameUser: string;
    statusPay: string;
    createAt: string;
    total: number;
  }
  


  export interface SelectOption {
    id: number;
    description: string;
  }

  export interface PayFormRespDTO {
    id: number;
    description: string;
  }

  export interface DetailsInvoiceReqDTO {

    productId: number
    description: string
    code: string,
    price: number,
    amount: number,
    subtotal: number,
  }

  export interface InvoiceFilterType {

    id: string;
    description: string;  
  }



  export interface InvoiceFullRespDTO {
    id: number;
    invoiceNumber: string;
    fullNameCustomer: string;
    emailCustomer: string;
    cellPhoneCustomer: string;
    fullNameUser: string;
    status: string;
    porcentajeIva: number;
    ivaValue: number;
    subTotal: number;
    statusPay: string;
    total: number;
    createAt: string;
    details: InvoiceDetail[];
    customerId: number;
    userId: number;
    companyId: number;
    invoicePayForm: InvoicePayForm[];
  }
  
  export interface InvoiceDetail {
    id: number;
    description: string;
    code: string;
    price: number;
    amount: number;
    subtotal: number;
    invoiceId: number;
    productId: number;
  }
  
  export interface InvoicePayForm {
    id: number;
    description: string;
    total: number;
    invoiceId: number;
    payFormId: number;
  }