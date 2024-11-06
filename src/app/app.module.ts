import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './inicio/dashboard/dashboard.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MetamaskService } from './services/metamask.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingInfomativoComponent } from './landing-infomativo/landing-infomativo.component';
import { AgroCryptoComponent } from './agro-crypto/agro-crypto.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LandingInfomativoComponent,
    AgroCryptoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [MetamaskService],  // Tus servicios aquí
  bootstrap: [AppComponent]
})
export class AppModule { }

// Cargar los archivos JSON de traducción desde 'assets/i18n/'
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
