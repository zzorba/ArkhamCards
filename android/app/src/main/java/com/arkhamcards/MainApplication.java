package com.arkhamcards;

import com.reactlibrary.RNAppAuthPackage;
import com.reactnativenavigation.NavigationApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.keychain.KeychainPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactPackage;
import com.cmcewen.blurview.BlurViewPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

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

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}

