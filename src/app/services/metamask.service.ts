import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  public web3: Web3 | undefined;
  private accountSubject = new BehaviorSubject<string | null>(null);
  private balanceSubject = new BehaviorSubject<string>('0');
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  account$ = this.accountSubject.asObservable();
  balance$ = this.balanceSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();

  private readonly STORAGE_KEY = 'metamask_transactions';

  constructor() {
    if (this.isMetaMaskInstalled()) {
      this.web3 = new Web3((window as any).ethereum);
      this.loadStoredTransactions();
      this.setupTransactionListener();
    } else {
      alert('MetaMask no está instalada. Por favor, instálala para continuar.');
    }
  }

  private isMetaMaskInstalled() {
    return Boolean((window as any).ethereum);
  }

  private loadStoredTransactions() {
    const storedTransactions = localStorage.getItem(this.STORAGE_KEY);
    if (storedTransactions) {
      const transactions = JSON.parse(storedTransactions);
      this.transactionsSubject.next(transactions);
    }
  }

  private saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  private setupTransactionListener() {
    if (this.web3) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          this.accountSubject.next(accounts[0]);
          this.updateBalance(accounts[0]);
        }
      });
    }
  }

  async connectWallet(): Promise<string | null> {
    if (this.web3) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        this.accountSubject.next(accounts[0]);
        await this.updateBalance(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error('Error conectando a MetaMask:', error);
        return null;
      }
    } else {
      console.error('Web3 no está inicializado');
      return null;
    }
  }

  async updateBalance(account: string) {
    if (this.web3) {
      const balanceWei = await this.web3.eth.getBalance(account);
      const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
      this.balanceSubject.next(balanceEth);
    }
  }

  async getTransactions(account: string): Promise<Transaction[]> {
    try {
      if (!this.web3) {
        throw new Error('Web3 no está inicializado');
      }
  
      const blockNumber = await this.web3.eth.getBlockNumber();
      const newTransactions: Transaction[] = [];
      const currentTransactions = this.transactionsSubject.getValue();
      const processedHashes = new Set(currentTransactions.map(tx => tx.hash));
  
      const blocksToCheck = Math.min(10, Number(blockNumber));
  
      console.log(`Revisando los últimos ${blocksToCheck} bloques...`);
  
      for (let i = Number(blockNumber); i > Number(blockNumber) - blocksToCheck; i--) {
        const block = await this.web3.eth.getBlock(i, true);
        if (block && block.transactions) {
          console.log(`Bloque número ${i} tiene ${block.transactions.length} transacciones.`);
  
          for (const tx of block.transactions) {
            if (typeof tx !== 'string' && 
                (tx.from.toLowerCase() === account.toLowerCase() || tx.to?.toLowerCase() === account.toLowerCase()) && 
                !processedHashes.has(tx.hash)) {
              const transaction: Transaction = {
                hash: tx.hash,
                from: tx.from,
                to: tx.to ?? '',
                value: this.web3.utils.fromWei(tx.value ?? '0', 'ether'),
                blockNumber: i.toString(), // Aquí se asigna el número de bloque
              };
              newTransactions.push(transaction);
            }
          }
        } else {
          console.warn(`No se pudo recuperar el bloque número ${i}`);
        }
      }
  
      // Combinar transacciones nuevas con las existentes y guardar
      if (newTransactions.length > 0) {
        const allTransactions = [...currentTransactions, ...newTransactions];
        this.saveTransactions(allTransactions);
        return allTransactions;
      }
  
      return currentTransactions;
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      return this.transactionsSubject.getValue();
    }
  }

  resetHistory() {
    this.transactionsSubject.next([]); // Limpiar las transacciones
    localStorage.removeItem(this.STORAGE_KEY); // Eliminar las transacciones almacenadas
    console.log('Historial de transacciones reseteado.');
  }
}  