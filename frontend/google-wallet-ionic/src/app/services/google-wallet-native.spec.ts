import { TestBed } from '@angular/core/testing';
import { GoogleWalletNative } from './google-wallet-native';

describe('GoogleWalletNative', () => {
  let service: GoogleWalletNative;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleWalletNative);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
