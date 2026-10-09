package io.ionic.starter;

import android.app.Activity;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoogleWalletPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onActivityResult(
            int requestCode,
            int resultCode,
            android.content.Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == 1001) {
            if (resultCode == Activity.RESULT_OK) {
                android.util.Log.d("GoogleWallet", "Save pass flow succeeded");
            } else if (resultCode == Activity.RESULT_CANCELED) {
                android.util.Log.d("GoogleWallet", "Save pass flow cancelled");
            } else {
                android.util.Log.d(
                        "GoogleWallet",
                        "Save pass flow result: " + resultCode);
            }
        }
    }
}
