const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
  },
  getBlacklistRE () {
    return blacklist([/react-native\/local-cli\/core\/__fixtures__.*/])
  },
}

