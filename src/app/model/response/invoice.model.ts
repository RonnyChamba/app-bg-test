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
