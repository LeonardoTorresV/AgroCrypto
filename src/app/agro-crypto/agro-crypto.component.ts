import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-agro-crypto',
  templateUrl: './agro-crypto.component.html',
  styleUrls: ['./agro-crypto.component.css']
})
export class AgroCryptoComponent implements OnInit {
  web3: any;
  contract: any;
  accounts: string[] = [];
  recipient: string = '';
  amount: number = 0;
  message: string = '';
  loading: boolean = false; // Nueva variable para controlar la carga


  contractAddress = '0xcD6a42782d230D7c13A74ddec5dD140e55499Df9'; // Dirección de tu contrato
  contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "EtherTransferRecorded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "recordTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor( private router: Router) {}

  ngOnInit() {
    this.initWeb3();
  }

  async initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      this.accounts = await this.web3.eth.getAccounts();
      this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);

      console.log(this.contract.methods);
      if (this.contract.methods.sendEther) {
        console.log('La función sendEther está disponible');
      } else {
        console.error('La función sendEther NO está disponible');
      }
    } else {
      alert('MetaMask no está instalado');
    }
  }

  async sendEther() {
    const weiAmount = this.web3.utils.toWei(this.amount.toString(), 'ether');

    if (!this.web3.utils.isAddress(this.recipient)) {
      alert('La dirección del destinatario no es válida');
      return;
    }

    if (this.amount <= 0) {
      alert('Por favor, introduce una cantidad válida');
      return;
    }

    console.log('Enviando', weiAmount, 'wei a', this.recipient);

    try {
      // Realizar la transferencia de Ether directamente al destinatario
      await this.web3.eth.sendTransaction({
        from: this.accounts[0],
        to: this.recipient,
        value: weiAmount
      });

      // Llamar al contrato para registrar la transacción
      const tx = await this.contract.methods.recordTransfer(this.recipient, weiAmount, this.message)
        .send({ from: this.accounts[0] });

      console.log('Registro exitoso en el contrato:', tx);
      alert('Transacción enviada y registrada en el contrato');
      this.resetForm();
    } catch (error) {
      console.error('Error en la transacción:', error);
      const errorMessage = (error as any).message || 'Error desconocido';
      alert('Error en la transacción: ' + errorMessage);
    }
  }
  resetForm() {
    this.recipient = '';
    this.amount = 0;
    this.message = '';
  }

  // Método para redirigir al usuario a la página de inicio
  goToLanding() {
    this.loading = true; // Mostrar barra de carga
    setTimeout(() => {
      this.loading = false; // Ocultar barra de carga
      this.router.navigate(['landing-informativo']);
    }, 3000); // Retraso de 3 segundos antes de la redirección
  }

  // Método para redirigir al usuario al historial de transacciones
  viewTransactionHistory() {
    this.router.navigate(['/Dashboard']); // Asegúrate de tener una ruta para el historial de transacciones
  }
}
