package com.arkhamcards;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

import com.reactnativenavigation.NavigationActivity;

import androidx.annotation.Nullable;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setSplashLayout();
    }

    private void setSplashLayout() {
        ImageView img = new ImageView(this);
        img.setImageDrawable(getDrawable(R.drawable.app_icon));
        img.setBackgroundColor(Color.parseColor("#513661"));
        setContentView(img);
    }
}
