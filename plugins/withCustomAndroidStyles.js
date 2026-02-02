const { withMod } = require('@expo/config-plugins');
const { parseStringPromise, Builder } = require('xml2js');

module.exports = function withCustomAndroidStyles(config) {
  return withMod(config, {
    platform: 'android',
    mod: 'styles',
    async action({ modResults, ...rest }) {
      // Parse the XML
      const xml = typeof modResults === 'string' ? modResults : new Builder().buildObject(modResults);
      const parsed = await parseStringPromise(xml);

      // Find AppTheme
      const styles = parsed.resources.style || [];
      const appTheme = styles.find(style => style.$.name === 'AppTheme');
      if (appTheme) {
        // https://github.com/facebook/react-native/issues/53286
        // https://github.com/facebook/react-native/issues/53666#issuecomment-3357502528
        const customItems = [
          { $: { name: 'android:elegantTextHeight' }, _: 'false' },
          { $: { name: 'android:useLocalePreferredLineHeightForMinimum' }, _: 'false' },
          // Prevents Android 15 from allocating extra width for complex shaping
          { $: { name: 'android:useBoundsForWidth' }, _: 'false' },
          { $: { name: 'android:shiftDrawingOffsetForStartOverhang' }, _: 'false' },
          // Add this for complete text compatibility
          { $: { name: 'android:includeFontPadding' }, _: 'true' },
        ];
        appTheme.item = appTheme.item || [];
        for (const item of customItems) {
          if (!appTheme.item.find(i => i.$.name === item.$.name)) {
            appTheme.item.push(item);
          }
        }
      }

      // Build XML back
      const builder = new Builder();
      const newXml = builder.buildObject(parsed);

      return { modResults: newXml, ...rest };
    },
  });
};
