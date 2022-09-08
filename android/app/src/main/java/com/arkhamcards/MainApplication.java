package com.arkhamcards;

import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationPackage;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import android.content.Context;
import com.facebook.react.config.ReactFeatureFlags;
import com.arkhamcards.newarchitecture.MainApplicationReactNativeHost;

import java.util.ArrayList;
import java.util.List;

public class MainApplication extends NavigationApplication {
    private final ReactNativeHost mNewArchitectureNativeHost =
        new MainApplicationReactNativeHost(this);

  private final ReactNativeHost mReactNativeHost =
    new NavigationReactNativeHost(this) {
        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected JSIModulePackage getJSIModulePackage() {
            return new ReanimatedJSIModulePackage();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        public List<ReactPackage> getPackages() {
            return new PackageList(this).getPackages();
        }
    };


    @Override
    public void onCreate() {
        super.onCreate();
        // If you opted-in for the New Architecture, we enable the TurboModule system
        ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        // registerExternalComponent("RNNCustomComponent", new FragmentCreator());
    }

    @Override
    public ReactNativeHost getReactNativeHost() {

        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            return mNewArchitectureNativeHost;
        } else {
            return mReactNativeHost;
        }
    }

    @Override
    protected void attachBaseContext(Context context) {
        super.attachBaseContext(context);
    }
}

