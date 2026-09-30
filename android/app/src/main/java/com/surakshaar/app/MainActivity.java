package com.surakshaar.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private long backPressedTime = 0;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ensure system status bar & navigation bar are styled and app renders strictly below status bar on all Android 10+ devices
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.parseColor("#FFFFFF"));
        window.setNavigationBarColor(Color.parseColor("#F7F5F1"));

        WindowInsetsControllerCompat insetsController =
            WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(true);
            insetsController.setAppearanceLightNavigationBars(true);
        }

        View rootContentView = findViewById(android.R.id.content);
        if (rootContentView != null) {
            rootContentView.setBackgroundColor(Color.parseColor("#FFFFFF"));
            ViewCompat.setOnApplyWindowInsetsListener(rootContentView, (v, insets) -> {
                Insets systemBars = insets.getInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
                );
                Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
                boolean imeVisible = insets.isVisible(WindowInsetsCompat.Type.ime());
                v.setPadding(
                    systemBars.left,
                    systemBars.top,
                    systemBars.right,
                    imeVisible ? ime.bottom : systemBars.bottom
                );
                return insets;
            });
        }

        // Initialize Android Hardware TextToSpeech
        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                ttsReady = true;
                try {
                    tts.setLanguage(new Locale("hi", "IN"));
                    tts.setSpeechRate(0.95f);
                } catch (Exception ignored) {}
            }
        });

        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            WebSettings settings = webView.getSettings();
            settings.setMediaPlaybackRequiresUserGesture(false);

            // Expose native TTS to JavaScript
            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void speak(String text, String lang) {
                    if (!ttsReady || tts == null || text == null || text.trim().isEmpty()) {
                        return;
                    }
                    runOnUiThread(() -> {
                        try {
                            if ("hi".equalsIgnoreCase(lang) || "sat".equalsIgnoreCase(lang) || "hinglish".equalsIgnoreCase(lang)) {
                                int r = tts.setLanguage(new Locale("hi", "IN"));
                                if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                                    tts.setLanguage(Locale.ENGLISH);
                                }
                            } else {
                                tts.setLanguage(Locale.ENGLISH);
                            }
                            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "SurakshaSpeechId");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }

                @JavascriptInterface
                public void stop() {
                    if (tts != null) {
                        runOnUiThread(() -> {
                            try {
                                tts.stop();
                            } catch (Exception ignored) {}
                        });
                    }
                }

                @JavascriptInterface
                public boolean isAvailable() {
                    return ttsReady;
                }
            }, "AndroidTTS");

            // Handle Android Hardware Back Button
            getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    webView.evaluateJavascript(
                        "(function() { if (window.__handleAndroidBack && window.__handleAndroidBack()) { return 'handled'; } return 'default'; })()",
                        result -> runOnUiThread(() -> {
                            if ("\"handled\"".equals(result)) {
                                return;
                            }
                            if (webView.canGoBack()) {
                                webView.goBack();
                            } else {
                                if (backPressedTime + 2000 > System.currentTimeMillis()) {
                                    finish();
                                } else {
                                    backPressedTime = System.currentTimeMillis();
                                    Toast.makeText(MainActivity.this, "Press back again to exit SurakshaAR", Toast.LENGTH_SHORT).show();
                                }
                            }
                        })
                    );
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }
}
