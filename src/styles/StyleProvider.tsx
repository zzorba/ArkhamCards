import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Dimensions, Platform, ScaledSize } from 'react-native';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';

import StyleContext, { DEFAULT_STYLE_CONTEXT } from './StyleContext';
import { getAppFontScale, getThemeOverride } from '@reducers';
import { DARK_THEME, LIGHT_THEME } from './theme';
import typography from './typography';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useSettingValue } from '@components/core/hooks';

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

function useDimensions(): [ScaledSize, ScaledSize] {
  const [windowDimensions, setWindowDimensions] = useState(() => Dimensions.get('window'));
  const [screenDimensions, setScreenDimensions] = useState(() => Dimensions.get('screen'));
  useEffect(() => {
    function handleChange({
      window,
      screen,
    }: { window: ScaledSize; screen: ScaledSize }) {
      if (
        windowDimensions.width !== window.width ||
        windowDimensions.height !== window.height ||
        windowDimensions.scale !== window.scale ||
        windowDimensions.fontScale !== window.fontScale
      ) {
        setWindowDimensions(window);
      }
      if (
        screenDimensions.width !== screen.width ||
        screenDimensions.height !== screen.height ||
        screenDimensions.scale !== screen.scale ||
        screenDimensions.fontScale !== screen.fontScale
      ) {
        setScreenDimensions(screen);
      }
    }
    const subscription = Dimensions.addEventListener('change', handleChange);
    // Read one last time, in case stuff 'moved' between last read and this.
    handleChange({ window: Dimensions.get('window'), screen: Dimensions.get('screen') });
    return () => {
      subscription.remove();
    };
  }, [windowDimensions, screenDimensions]);

  return [windowDimensions, screenDimensions];
}

export default function StyleProvider({ children } : Props) {
  const { lang, usePingFang } = useContext(LanguageContext);
  const themeOverride = useSelector(getThemeOverride);
  const appFontScale = useSelector(getAppFontScale);
  const colorScheme = useColorScheme();
  const androidOneUiFix = useSettingValue('android_one_ui_fix');
  const justifyContent = false;
  const [
    { fontScale, width: windowWidth, height: windowHeight, scale: windowScale },
    { scale: screenScale },
  ] = useDimensions();
  const [width, height] = useMemo(() => {
    if (windowScale !== 0 && androidOneUiFix && Platform.OS === 'android') {
      const scaleFactor = screenScale / windowScale;
      return [
        windowWidth * scaleFactor,
        windowHeight * scaleFactor,
      ];
    }
    return [windowWidth, windowHeight];
  }, [windowWidth, windowHeight, windowScale, screenScale, androidOneUiFix]);
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
