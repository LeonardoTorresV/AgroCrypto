import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Importa Bootstrap para el modal
import { Observable } from 'rxjs';
import { MetamaskService } from 'src/app/services/metamask.service';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  timestamp?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  account: string | null = null;
  recipientAccount: string = '';
  amount: number | null = null;
  concept: string = '';
  balance: string = '0';
  showTransactions: boolean = true; // Inicialmente en true
  transactions: Observable<Transaction[]>;

  constructor(private metamaskService: MetamaskService) {
    this.transactions = this.metamaskService.transactions$;
  }

  ngOnInit() {
    this.metamaskService.account$.subscribe((account) => {
      this.account = account;
      console.log("Cuenta conectada:", account);

      if (account) {
        this.metamaskService.updateBalance(account);
        this.loadTransactions(account); // Cargar transacciones al inicio
      }
    });

    this.metamaskService.balance$.subscribe((balance) => {
      this.balance = balance;
    });
  }

  // Método para alternar la vista (puedes dejarlo como estaba o eliminarlo si siempre quieres mostrar transacciones)
  toggleTransactions() {
    this.showTransactions = !this.showTransactions;

    // Cargar transacciones si se están mostrando
    if (this.showTransactions && this.account) {
      this.loadTransactions(this.account);
    }
  }

  openModal() {
    // Abre el modal
    const modal = new bootstrap.Modal(document.getElementById('sendMoneyModal')!);
    modal.show();
  }

  async loadTransactions(account: string) {
    try {
      await this.metamaskService.getTransactions(account);
      this.showTransactions = true;
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    }
  }

  // Método para enviar dinero
  async sendMoney() {
    // Validaciones previas
    if (!this.recipientAccount || this.recipientAccount.trim() === '') {
      alert("La cuenta del destinatario no puede estar vacía.");
      return;
    }

    if (!this.concept) {
      alert("Por favor, ingrese un concepto.");
      return;
    }

    if (this.amount === null || this.amount <= 0) {
      alert("Por favor, ingrese un monto válido.");
      return;
    }

    // Verifica si la dirección es válida
    if (!this.metamaskService.web3 || !this.metamaskService.web3.utils.isAddress(this.recipientAccount)) {
      alert("La cuenta del destinatario no es válida.");
      return;
    }

    // Verificar que la cuenta no sea null
    if (!this.account) {
      alert("No se ha conectado a ninguna cuenta.");
      return;
    }

    try {
      // Obtener el precio del gas actual
      const gasPrice = await this.metamaskService.web3.eth.getGasPrice();
      const maxFeePerGas = BigInt(gasPrice) * BigInt(2); // Duplicar el gas actual como un ejemplo
      const maxPriorityFeePerGas = BigInt(gasPrice) / BigInt(2); // Establecer una tarifa prioritaria inferior

      const transaction = {
        from: this.account, // Aquí aseguramos que this.account no sea null
        to: this.recipientAccount,
        value: this.metamaskService.web3.utils.toWei(this.amount.toString(), 'ether'), // Convertir a Wei
        gas: 21000, // Cantidad de gas a utilizar
        maxFeePerGas: maxFeePerGas.toString(), // Nueva propiedad para la tarifa máxima
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), // Nueva propiedad para la tarifa prioritaria
      };

      // Agregar detalles de la transacción a la consola
      console.log("Detalles de la transacción:");
      console.log(`Desde: ${transaction.from}`);
      console.log(`Para: ${transaction.to}`);
      console.log(`Cantidad: ${this.amount} ETH (${transaction.value} Wei)`);
      console.log(`Gas: ${transaction.gas}`);
      console.log(`Tarifa máxima por gas: ${transaction.maxFeePerGas}`);
      console.log(`Tarifa prioritaria por gas: ${transaction.maxPriorityFeePerGas}`);

      // Enviar transacción
      const txHash = await this.metamaskService.web3.eth.sendTransaction(transaction);
      console.log(`Transacción enviada: ${txHash}`);

      // Actualizar balance después de la transacción
      await this.metamaskService.updateBalance(this.account);

      // Cierra el modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('sendMoneyModal')!);
      modal?.hide();

      // Limpia los campos del formulario
      this.recipientAccount = '';
      this.concept = '';
      this.amount = null;
      this.loadTransactions(this.account); // Recargar transacciones después de enviar dinero
    } catch (error) {
      console.error('Error al enviar dinero:', error);
      alert("Hubo un error al enviar dinero. Verifica los detalles e intenta nuevamente.");
    }
  }

  clearHistory() {
    this.metamaskService.resetHistory();
  }
}