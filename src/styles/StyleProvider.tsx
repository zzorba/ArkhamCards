import React, { useContext, useMemo } from 'react';
import { Appearance, Dimensions, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';

import StyleContext, { DEFAULT_STYLE_CONTEXT } from './StyleContext';
import { getAppFontScale, getThemeOverride } from '@reducers';
import { DARK_THEME, LIGHT_THEME } from './theme';
import typography from './typography';
import LanguageContext from '@lib/i18n/LanguageContext';

const EXTRA_BOLD_ITALIC = 'Alegreya-ExtraBoldItalic';
function useColorScheme(delay = 2000) {
  const [colorScheme, setColorScheme] = React.useState(
    Appearance.getColorScheme()
  );
  const onColorSchemeChange = useMemo(() =>
    throttle(({ colorScheme }) => {
      setColorScheme(colorScheme);
    },
    delay,
    {
      leading: false,
      trailing: true,
    })
  , [setColorScheme, delay]);
  React.useEffect(() => {
    const listener = Appearance.addChangeListener(onColorSchemeChange);
    return () => {
      onColorSchemeChange.cancel();
      listener.remove();
    };
  }, [onColorSchemeChange]);
  return colorScheme;
}
interface Props {
  children: React.ReactNode;
}

export default function StyleProvider({ children } : Props) {
  const { lang, usePingFang } = useContext(LanguageContext);
  const themeOverride = useSelector(getThemeOverride);
  const appFontScale = useSelector(getAppFontScale);
  const colorScheme = useColorScheme();
  const justifyContent = false; // useSelector((state: AppState) => !!state.settings.justifyContent);
  const { fontScale, width: windowWidth, height: windowHeight, scale: windowScale } = useWindowDimensions();
  const { scale: screenScale } = useMemo(() => Dimensions.get('screen'), []);
  const { width, height } = useMemo(() => {
    if (windowScale !== 0) {
      const scaleFactor = screenScale / windowScale;
      return {
        width: windowWidth * scaleFactor,
        height: windowHeight * scaleFactor,
      };
    }
    return {
      width: windowWidth,
      height: windowHeight,
    };
  }, [windowWidth, windowHeight, windowScale, screenScale]);
  const darkMode = (themeOverride ? themeOverride === 'dark' : colorScheme === 'dark');
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;
  const gameFont = lang === 'ru' ? 'Teutonic RU' : 'Teutonic';
  const italicFont = usePingFang ? 'PingFangTC-Light' : 'Alegreya-Italic';
  const boldItalicFont = usePingFang ? 'PingFangTC-Semibold' : EXTRA_BOLD_ITALIC;
  const styleTypography = useMemo(() => typography(
    appFontScale,
    colors,
    italicFont,
    boldItalicFont,
    gameFont,
    lang
  ), [appFontScale, colors, gameFont, boldItalicFont, italicFont, lang]);

  const context = useMemo(() => {
    return {
      ...DEFAULT_STYLE_CONTEXT,
      darkMode,
      fontScale: fontScale * appFontScale,
      width,
      height,
      typography: styleTypography,
      colors,
      gameFont,
      justifyContent,
      italicFont,
      backgroundStyle: {
        backgroundColor: colors.background,
      },
      borderStyle: {
        borderColor: colors.divider,
      },
      disabledStyle: {
        backgroundColor: colors.disableOverlay,
      },
    };
  }, [darkMode, fontScale, appFontScale, styleTypography, italicFont, colors, gameFont, width, height, justifyContent]);
  return (
    <StyleContext.Provider value={context}>
      { children }
    </StyleContext.Provider>
  );
}
