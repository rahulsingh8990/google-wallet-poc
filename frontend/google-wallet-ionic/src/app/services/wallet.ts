import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

interface WalletLinkResponse {
  objectId: string;
  classId: string;
  addToWalletUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private backendUrl: string;

  constructor(private http: HttpClient, private platform: Platform) {
    this.backendUrl = this.platform.is('android')
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000';
  }

  getAddToWalletLink(): Observable<WalletLinkResponse> {
    console.log("**********backendurl&*********")
    console.log(this.backendUrl)
    return this.http.get<WalletLinkResponse>(
      `${this.backendUrl}/wallet/add-link`
    );
  }
  getSignedWalletJwt(): Observable<{ jwt: string }> {
  return this.http.get<{ jwt: string }>(
    `${this.backendUrl}/wallet/add-link`
  );
}
}