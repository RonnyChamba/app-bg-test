export interface UsuarioReqDTO {
    names: string;
    lasName: string;
    username: string;
    email: string;
    rol: string;
  }
  
  export interface CompanyReqDTO {
    fullName: string;
    porcentajeIva: number;
    city: string;
    userReqDTO: UsuarioReqDTO;
  }

  export interface CompanySimpleReqDTO {
    fullName: string;
    porcentajeIva: number;
    city: string;
  }