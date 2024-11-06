import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './inicio/dashboard/dashboard.component';
import { LandingInfomativoComponent } from './landing-infomativo/landing-infomativo.component';
import { AgroCryptoComponent } from './agro-crypto/agro-crypto.component';

const routes: Routes = [
  {
    path: '',
    component: LandingInfomativoComponent,
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'landing-informativo', component: LandingInfomativoComponent },
  { path: 'inicio', component: AgroCryptoComponent }, // Asegúrate de que este es tu componente
  { path: 'Dashboard', component: DashboardComponent }, // Asegúrate de que este es tu componente

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
