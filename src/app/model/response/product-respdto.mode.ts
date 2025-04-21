export interface ProductRespDTO {
    id: number;
    code: string;
    description: string;
    price: number;
    status: string;
    createAt: string;
    saleCount: number;
  }


  export interface ProductItemSelected {
    id: number;
    code: string;
    description: string;
    price: number;
    status: string;
    createAt: string;
    saleCount: number;
    selectedAmount?: number; 
  }
  