
package io.ionic.starter;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.pay.Pay;
import com.google.android.gms.pay.PayClient;
import com.google.android.gms.pay.PayApiAvailabilityStatus;
import android.app.Activity;
import com.google.android.gms.pay.PayApiAvailabilityStatus;

@CapacitorPlugin(name = "GoogleWallet")
public class GoogleWalletPlugin extends Plugin {

    @PluginMethod()
    public void checkAvailability(PluginCall call) {
        PayClient walletClient = Pay.getClient(getContext());

        walletClient
                .getPayApiAvailabilityStatus(
                        PayClient.RequestType.SAVE_PASSES)
                .addOnSuccessListener(status -> {
                    JSObject result = new JSObject();
                    result.put("status", status);
                    result.put(
                            "available",
                            status == PayApiAvailabilityStatus.AVAILABLE);
                    call.resolve(result);
                })
                .addOnFailureListener(error -> {
                    call.reject(
                            "Failed to check Google Wallet availability",
                            error);
                });
    }

    @PluginMethod()
    public void savePass(PluginCall call) {
        android.util.Log.d("GoogleWallet", "savePass called");

        String jwt = call.getString("jwt");

        if (jwt == null || jwt.isEmpty()) {
            android.util.Log.e("GoogleWallet", "JWT is missing");
            call.reject("Missing signed Google Wallet JWT");
            return;
        }

        android.util.Log.d("GoogleWallet", "JWT received; invoking Wallet SDK");

        PayClient walletClient = Pay.getClient(getContext());
        Activity activity = getActivity();

        walletClient.savePassesJwt(jwt, activity, 1001);
    }
}
