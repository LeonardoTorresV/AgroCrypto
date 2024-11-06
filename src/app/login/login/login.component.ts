import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MetamaskService } from 'src/app/services/metamask.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading: boolean = false; // Variable para controlar la carga

  constructor(private metamaskService: MetamaskService, private router: Router) { }

  async connectMetamask() {
    this.loading = true; // Mostrar barra de carga
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño retraso para que Angular muestre la pantalla de carga

    try {
      const account = await this.metamaskService.connectWallet();
      if (account) {
        setTimeout(() => {
          // Ocultar barra de carga y redirigir después de un breve retraso
          this.loading = false;
          this.router.navigate(['/inicio']);
        }, 3000); // Agrega un retraso de 1 segundo para que la pantalla de carga sea visible
      } else {
        this.loading = false; // Ocultar barra de carga si la conexión falla
        // Puedes añadir una alerta aquí si la conexión falla
      }
    } catch (error) {
      console.error("Error al conectar con MetaMask:", error);
      this.loading = false; // Asegurar que la barra de carga se oculta en caso de error
      // Mostrar mensaje de error si es necesario
    }
  }

}
