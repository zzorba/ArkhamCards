package com.arkhamcards;

import android.graphics.drawable.Drawable;
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
    }

    @Override protected void addDefaultSplashLayout() {
        SplashScreen.installSplashScreen(this);
        super.addDefaultSplashLayout();
    }
}
