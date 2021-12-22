module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          '@assets': './assets',
          '@app': './src/app',
          '@actions': './src/actions',
          '@components': './src/components',
          '@app_constants': './src/app_constants.ts',
          '@data': './src/data',
          '@generated': './src/generated',
          '@icons': './src/icons',
          '@lib': './src/lib',
          '@reducers': './src/reducers',
          '@styles': './src/styles',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ]
};

