package com.goc.GOC;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import com.microsoft.codepush.react.ReactInstanceHolder;


public class MainApplication extends Application implements ReactApplication {
  public class MyReactNativeHost extends ReactNativeHost implements ReactInstanceHolder {
    MyReactNativeHost(Application application) {
      super(application);
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new TrackPlayer(),
        new MainReactPackage(),
        new CodePush("yeqaqYL4qIOT2uwxNecL9bkS3l85449c462d-8670-4950-b4c5-22e82dc7fad3", MainApplication.this, BuildConfig.DEBUG),
        new FastImageViewPackage(),
        new SvgPackage(),
        new SplashScreenReactPackage(),
        new LinearGradientPackage(),
        new VectorIconsPackage(),
        new RNFirebasePackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseFunctionsPackage(),
        new RNFirebaseFirestorePackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseNotificationsPackage()
      );
    }
  }

  private final MyReactNativeHost mReactNativeHost = new MyReactNativeHost(this);

  public void onCreate() {
    CodePush.setReactInstanceHolder(mReactNativeHost);
    super.onCreate();
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
}
