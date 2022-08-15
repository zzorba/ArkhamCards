package com.arkhamcards;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AnticipateInterpolator;
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

    public LinearLayout createLegacySplashLayout() {
        LinearLayout splash = new LinearLayout(this);
        Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(), R.drawable.splash);
        splash.setBackground(launch_screen_bitmap);
        return splash;
    }

    @Override protected void addDefaultSplashLayout() {
        if (Build.VERSION.SDK_INT >= 23) {
            final SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
            splashScreen.setOnExitAnimationListener(splashScreenViewProvider -> {
                final View splashScreenView = splashScreenViewProvider.getView();
                final ObjectAnimator slideUp = ObjectAnimator.ofFloat(
                        splashScreenView,
                        View.TRANSLATION_Y,
                        0f,
                        -splashScreenView.getHeight()
                );
                slideUp.setInterpolator(new AnticipateInterpolator());
                slideUp.setDuration(600L);

                // Call SplashScreenView.remove at the end of your custom animation.
                slideUp.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        splashScreenViewProvider.remove();
                    }
                });

                // Run your animation.
                slideUp.start();
            });
            super.addDefaultSplashLayout();
        } else {
            setContentView(this.createLegacySplashLayout());
        }
    }
}
