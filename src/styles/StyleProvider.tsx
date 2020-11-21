import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import { ThemeProvider } from 'react-native-elements';

import StyleContext from './StyleContext';
import { getAppFontScale, getLangPreference, getThemeOverride } from '@reducers';
import { DARK_THEME, LIGHT_THEME } from './theme';
import typography from './typography';

interface OwnProps {
  children: React.ReactNode;
}

interface ReduxProps {
  lang: string;
  themeOverride?: 'dark' | 'light';
  appFontScale: number;
}

type Props = OwnProps & ReduxProps;

interface State {
  colorScheme: ColorSchemeName;
  fontScale: number;
}


const LIGHT_ELEMENTS_THEME = {
  Button: {
    raised: true,
    disabledTitleStyle: {
      color: '#444444',
    },
    disabledStyle: {
      backgroundColor: '#dddddd',
    },
  },
};

const DARK_ELEMENTS_THEME = {
  Button: {
    raised: true,
    disabledTitleStyle: {
      color: '#bbbbbb',
    },
    disabledStyle: {
      backgroundColor: '#111111',
    },
  },
};

export default function StyleProvider({ children } : Props) {
  const lang = useSelector(getLangPreference);
  const themeOverride = useSelector(getThemeOverride);
  const appFontScale = useSelector(getAppFontScale);
  const colorScheme = useColorScheme();
  const { fontScale } = useWindowDimensions();
  const darkMode = (themeOverride ? themeOverride === 'dark' : colorScheme === 'dark');
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;
  const gameFont = lang === 'ru' ? 'Conkordia' : 'Teutonic';
  const styleTypography = useMemo(() => typography(appFontScale, colors, gameFont), [appFontScale, colors, gameFont]);
  const context = useMemo(() => {
    return {
      darkMode,
      fontScale,
      typography: styleTypography,
      colors,
      gameFont,
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
  }, [darkMode, fontScale, styleTypography, colors, gameFont]);
  return (
    <StyleContext.Provider value={context}>
      <ThemeProvider theme={darkMode ? DARK_ELEMENTS_THEME : LIGHT_ELEMENTS_THEME}>
        { children }
      </ThemeProvider>
    </StyleContext.Provider>
  );
}
