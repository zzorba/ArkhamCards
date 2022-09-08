package com.arkhamcards;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.LinearLayout;
import androidx.core.splashscreen.SplashScreen;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.reactnativenavigation.NavigationActivity;

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
            splashScreen.setOnExitAnimationListener((splashScreenViewProvider) -> {
                final View splashScreenView = splashScreenViewProvider.getView();
                final ObjectAnimator fadeOut = ObjectAnimator.ofFloat(
                        splashScreenView,
                        View.ALPHA,
                        1f,
                        0f
                );
                final ObjectAnimator sizeUpX = ObjectAnimator.ofFloat(
                    splashScreenView,
                    View.SCALE_X,
                    1f,
                    1.2f
                );
                final ObjectAnimator sizeUpY = ObjectAnimator.ofFloat(
                        splashScreenView,
                        View.SCALE_Y,
                        1f,
                        1.2f
                );

                AnimatorSet animatorSet = new AnimatorSet();
                animatorSet.playTogether(fadeOut, sizeUpX, sizeUpY);
                animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
                animatorSet.setDuration(600L);

                // Call SplashScreenView.remove at the end of your custom animation.
                animatorSet.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        splashScreenViewProvider.remove();
                    }
                });

                // Run your animation.
                animatorSet.start();
            });
            splashScreen.setKeepOnScreenCondition(() -> !this.rootPresenter.setRootCalled());
            super.addDefaultSplashLayout();
        } else {
            setContentView(this.createLegacySplashLayout());
        }
    }
}
