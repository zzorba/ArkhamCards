package com.arkhamcards;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.horcrux.svg.SvgPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnappauth.RNAppAuthPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

import io.realm.react.RealmReactPackage;

public class MainApplication extends NavigationApplication {

  @Override
  protected ReactGateway createReactGateway() {
    ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };
    return new ReactGateway(this, isDebug(), host);
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }
    
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new ReactNativeConfigPackage(),
        new RNAppAuthPackage(),
        new VectorIconsPackage(),
        new RNFetchBlobPackage(),
        new SvgPackage(),
        new KeychainPackage(),
        new RealmReactPackage(),
        new LinearGradientPackage(),
        new BlurViewPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}

