# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Don't strip out stuff from react-native-svg
# see https://github.com/react-native-community/react-native-svg/issues/481
-keep public class com.horcrux.svg.** {*;}

-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.arkhamcards.BuildConfig { *; }
-keep class com.facebook.crypto.** {
   *;
}

# Keep the class names used to check for availablility
-keepnames class com.facebook.login.LoginManager

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Don't note a bunch of dynamically referenced classes
-dontnote com.google.**
-dontnote com.facebook.**
-dontnote com.squareup.okhttp.**
-dontnote okhttp3.internal.**

# Recommended flags for Firebase Auth
-keepattributes Signature
-keepattributes *Annotation*

# Retrofit config
-dontnote retrofit2.Platform
-dontwarn retrofit2.**
-dontwarn okhttp3.**
-dontwarn okio.**
-keepattributes Exceptions

# TODO remove https://github.com/google/gson/issues/1174
-dontwarn com.google.gson.Gson$6

# react-native-firebase section
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

