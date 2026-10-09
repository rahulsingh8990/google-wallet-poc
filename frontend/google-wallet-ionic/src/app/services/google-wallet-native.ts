
import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';

interface GoogleWalletNativePlugin {
  checkAvailability(): Promise<{
    status: number;
    available: boolean;
  }>;

  savePass(options: { jwt: string }): Promise<void>;
}

const GoogleWalletNative =
  registerPlugin<GoogleWalletNativePlugin>('GoogleWallet');

@Injectable({
  providedIn: 'root'
})
export class GoogleWalletNativeService {
  checkAvailability() {
    return GoogleWalletNative.checkAvailability();
  }

  savePass(jwt: string) {
    return GoogleWalletNative.savePass({ jwt });
  }
}
