const { withMainActivity } = require('@expo/config-plugins');

/**
 * Config plugin to add RNScreens Fragment Factory setup to MainActivity
 * Required to prevent crashes during Activity restarts
 * See: https://github.com/software-mansion/react-native-screens#android
 */
const withRNScreensFragmentFactory = (config) => {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === 'java') {
      // Java implementation
      config.modResults.contents = addFragmentFactoryJava(config.modResults.contents);
    } else {
      // Kotlin implementation (default)
      config.modResults.contents = addFragmentFactoryKotlin(config.modResults.contents);
    }
    return config;
  });
};

function addFragmentFactoryJava(mainActivityJava) {
  // Add import if not already present
  if (!mainActivityJava.includes('com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory')) {
    mainActivityJava = mainActivityJava.replace(
      /import com\.facebook\.react\.ReactActivity;/,
      `import com.facebook.react.ReactActivity;
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;`
    );
  }

  // Add fragment factory setup in onCreate before super.onCreate
  if (!mainActivityJava.includes('RNScreensFragmentFactory()')) {
    mainActivityJava = mainActivityJava.replace(
      /(protected void onCreate\(Bundle savedInstanceState\) \{[^\}]*?)(super\.onCreate\()/,
      '$1    getSupportFragmentManager().setFragmentFactory(new RNScreensFragmentFactory());\n    $2'
    );
  }

  return mainActivityJava;
}

function addFragmentFactoryKotlin(mainActivityKotlin) {
  // Add import if not already present
  if (!mainActivityKotlin.includes('com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory')) {
    mainActivityKotlin = mainActivityKotlin.replace(
      /import com\.facebook\.react\.ReactActivity/,
      `import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
import com.facebook.react.ReactActivity`
    );
  }

  // Add fragment factory setup in onCreate before super.onCreate
  if (!mainActivityKotlin.includes('RNScreensFragmentFactory()')) {
    mainActivityKotlin = mainActivityKotlin.replace(
      /(override fun onCreate\(savedInstanceState: Bundle\?\) \{[^\}]*?)(super\.onCreate\()/,
      '$1    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()\n    $2'
    );
  }

  return mainActivityKotlin;
}

module.exports = withRNScreensFragmentFactory;
