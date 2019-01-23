const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  getBlacklistRE () {
    return blacklist([/react-native\/local-cli\/core\/__fixtures__.*/])
  },
}

