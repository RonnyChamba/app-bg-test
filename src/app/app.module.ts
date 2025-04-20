import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistreformComponent } from './pages/clientes/components/registreform/registreform.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { UsuarioFormComponent } from './pages/usuarios/components/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './pages/usuarios/components/usuario-list/usuario-list.component';
import { ChangePasswordComponent } from './pages/usuarios/components/change-password/change-password.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoListComponent } from './pages/productos/components/producto-list/producto-list.component';
import { ProductoFormComponent } from './pages/productos/components/producto-form/producto-form.component';
import { CompanyFormComponent } from './auth/components/company-form/company-form.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { FacturaListComponent } from './pages/facturas/components/factura-list/factura-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ClientesComponent,
    RegistreformComponent,
    UsuariosComponent,
    UsuarioFormComponent,
    UsuarioListComponent,
    ChangePasswordComponent,
    ProductosComponent,
    ProductoListComponent,
    ProductoFormComponent,
    CompanyFormComponent,
    FacturasComponent,
    FacturaListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
