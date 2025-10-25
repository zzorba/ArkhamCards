module.exports = {
  presets: [
    'babel-preset-expo',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
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
          '@app': './src/application',
          '@actions': './src/actions',
          '@components': './src/components',
          '@app_constants': './src/app_constants.ts',
          '@data': './src/data',
          '@generated': './src/generated',
          '@icons': './src/icons',
          '@lib': './src/lib',
          '@navigation': './src/navigation',
          '@reducers': './src/reducers',
          '@styles': './src/styles',
        },
      },
    ],
  ],
};