module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          app: './src/app',
          actions: './src/actions',
          components: './src/components',
          data: './src/data',
          icons: './src/icons',
          lib: './src/lib',
          reducers: './src/reducers',
          styles: './src/styles',
        },
      },
    ],
  ]
};

