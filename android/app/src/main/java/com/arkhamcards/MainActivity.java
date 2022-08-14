package com.arkhamcards;

import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.widget.LinearLayout;
import androidx.core.splashscreen.SplashScreen;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import android.app.Activity;

import com.reactnativenavigation.NavigationActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import javax.annotation.Nonnull;

public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT < 23) {
            setContentView(this.createLegacySplashLayout());
        }
    }

    public LinearLayout createLegacySplashLayout() {
        LinearLayout splash = new LinearLayout(this);
        Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(), R.drawable.splash);
        splash.setBackground(launch_screen_bitmap);
        return splash;
    }

    @Override protected void addDefaultSplashLayout() {
        if (Build.VERSION.SDK_INT >= 23) {
            SplashScreen.installSplashScreen(this);
        }
        super.addDefaultSplashLayout();
    }

    /*
    @Override
    protected boolean isConcurrentRootEnabled() {
        // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
        // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
        return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
     */
}
