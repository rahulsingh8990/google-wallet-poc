import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular';
import { WalletService } from '../services/wallet';
import { Browser } from '@capacitor/browser';
import { GoogleWalletNativeService } from '../services/google-wallet-native';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class HomePage {
  constructor(
    private walletService: WalletService,
    private googleWalletNative: GoogleWalletNativeService
  ) {}

  // Add to Google Wallet using the backend service Pure JS with localhost
  addToWallet() {
    this.walletService.getAddToWalletLink().subscribe({
      next: (response) => {
        window.location.href = response.addToWalletUrl;
      },
      error: (error) => {
        console.error('Failed to get Google Wallet link:', error);
      }
    });
  }

  // Add to Google Wallet using the backend service and JS with Capacitor Browser plugin
  addToWalletNative() {
    this.walletService.getAddToWalletLink().subscribe({
      next: async (response) => {
        console.log('Wallet URL:', response.addToWalletUrl);
        await Browser.open({ url: response.addToWalletUrl });
      },
      error: (error) => {
        console.error('Failed to get Google Wallet link:', error);
      }
    });
  }
  // Check if Google Wallet is installed on the device using the native plugin
async checkNativeWallet() {
  try {
    const result = await this.googleWalletNative.checkAvailability();

    console.log('Google Wallet availability:', result);
    alert(JSON.stringify(result));
  } catch (error) {
    console.error('Native Wallet check failed:', error);
    alert('Native Wallet check failed. Check Logcat.');
  }
}

// Save a pass to Google Wallet using the native plugin and launch
async saveViaNativeWallet() {
  try {
    const response = await this.walletService
      .getSignedWalletJwt()
      .toPromise();

    if (!response?.jwt) {
      throw new Error('Backend response does not contain a JWT');
    }

    await this.googleWalletNative.savePass(response.jwt);
  } catch (error) {
    console.error('Native Wallet save failed:', error);
    alert('Native Wallet save failed. Check Logcat and console.');
  }
}

}
