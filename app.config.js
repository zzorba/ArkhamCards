const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('.env file not found');
    return {};
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+?)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith(`'`) && value.endsWith(`'`)) {
        value = value.substring(1, value.length - 1);
      }

      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();

module.exports = {
  expo: {
    name: 'ArkhamCards',
    slug: 'arkhamcards',
    version: '6.0.0',
    jsEngine: 'hermes',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    scheme: 'arkhamcards',
    icon: './assets/app-icon.png',
    splash: {
      image: './assets/splash-logo.png',
      backgroundColor: '#513661',
      resizeMode: 'contain',
    },
    experiments: {
      reactCanary: false,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '33fc527e-b434-45fe-97ba-d05543c3a653',
      },
      OAUTH_SITE: env.OAUTH_SITE || process.env.OAUTH_SITE,
      OAUTH_CLIENT_ID: env.OAUTH_CLIENT_ID || process.env.OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET: env.OAUTH_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET,
    },
    assetBundlePatterns: [
      'assets/*.ttf',
      'assets/!(app-icon|splash-logo|ic_launcher_foreground).png',
      'assets/*.jpg',
      'assets/*.jpeg',
      'assets/*.svg',
      'assets/*.json',
    ],
    ios: {
      bundleIdentifier: 'com.arkhamcards.ArkhamCards',
      appleTeamId: '54773FU58P',
      supportsTablet: true,
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: true,
        ITSAppUsesNonExemptEncryption: false,
      },
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      package: 'com.arkhamcards',
      adaptiveIcon: {
        foregroundImage: './assets/ic_launcher_foreground.png',
        backgroundColor: '#513661',
      },
      googleServicesFile: './google-services.json',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.MODIFY_AUDIO_SETTINGS',
      ],
      versionCode: 4195518,
    },
    plugins: [
      [
        'react-native-edge-to-edge',
        {
          android: {
            parentTheme: 'Default',
            enforceNavigationBarContrast: true,
          },
        },
      ],
      [
        'expo-asset',
        {
          assets: [
            './assets/generated',
          ],
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: 'react-native',
          organization: 'arkham-cards',
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            deploymentTarget: '15.1',
          },
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
          },
        },
      ],
      [
        'expo-plugin-ios-static-libraries',
        {
          libs: [
            'op-sqlite',
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#513661',
          image: './assets/splash-logo.png',
          imageWidth: 200,
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/AboutDead.ttf',
            './assets/ages.ttf',
            './assets/Alegreya-Bold.ttf',
            './assets/Alegreya-BoldItalic.ttf',
            './assets/Alegreya-ExtraBold.ttf',
            './assets/Alegreya-ExtraBoldItalic.ttf',
            './assets/Alegreya-Italic.ttf',
            './assets/Alegreya-Medium.ttf',
            './assets/Alegreya-MediumItalic.ttf',
            './assets/Alegreya-Regular.ttf',
            './assets/AlegreyaSC-Medium.ttf',
            './assets/alice.ttf',
            './assets/AnkeCalligraphicFG.ttf',
            './assets/app.ttf',
            './assets/Arkhamic.ttf',
            './assets/arkhamicons.ttf',
            './assets/arkhamslim.ttf',
            './assets/carcosa.ttf',
            './assets/cardicons.ttf',
            './assets/Caveat.ttf',
            './assets/circle.ttf',
            './assets/circusexmortis.ttf',
            './assets/Conkordia.ttf',
            './assets/coreset.ttf',
            './assets/cost.ttf',
            './assets/cyclopean.ttf',
            './assets/dark_matter.ttf',
            './assets/DMSerifDisplay-Italic.ttf',
            './assets/DMSerifDisplay-Regular.ttf',
            './assets/dreameaters.ttf',
            './assets/drowned.ttf',
            './assets/dunwich.ttf',
            './assets/edge.ttf',
            './assets/forgotten.ttf',
            './assets/hemlock.ttf',
            './assets/innsmouth.ttf',
            './assets/oz.ttf',
            './assets/scarlet.ttf',
            './assets/standalone.ttf',
            './assets/Teutonic RU.ttf',
            './assets/Teutonic.ttf',
            './assets/tokens.ttf',
            './assets/TT2020StyleE-Regular.ttf',
          ],
        },
      ],
      'expo-audio',
    ],
  },
};
