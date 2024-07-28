module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    '@babel/preset-typescript',
  ],
  plugins: [
  	["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
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

