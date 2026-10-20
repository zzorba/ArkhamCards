const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin to enable native (NDK) symbol upload for Firebase Crashlytics.
 * This lets Crashlytics symbolicate native crashes (SIGSEGV, etc.) in
 * libreactnative.so, libhermesvm.so, and other native libraries.
 */
const withCrashlyticsNativeSymbols = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = addNativeSymbolUpload(config.modResults.contents);
    }
    return config;
  });
};

function addNativeSymbolUpload(buildGradle) {
  if (buildGradle.includes('nativeSymbolUploadEnabled')) {
    return buildGradle;
  }

  const block = `
firebaseCrashlytics {
    nativeSymbolUploadEnabled true
}
`;

  // Insert after the crashlytics plugin apply line
  return buildGradle.replace(
    /apply plugin: ['"]com\.google\.firebase\.crashlytics['"]/,
    `$&\n${block}`
  );
}

module.exports = withCrashlyticsNativeSymbols;
