package com.arkhamcards;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.reactnativenavigation.NavigationActivity;

import androidx.annotation.Nullable;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        // Accept edge-to-edge but handle insets properly for API 35+
        if (Build.VERSION.SDK_INT >= 35) {
            WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        }
        super.onCreate(savedInstanceState);
        setSplashLayout();
        
        // Let individual components handle their own insets
    }

    private void setSplashLayout() {
        ImageView img = new ImageView(this);
        img.setImageDrawable(getDrawable(R.drawable.app_icon));
        img.setBackgroundColor(Color.parseColor("#513661"));
        setContentView(img);
    }
}
