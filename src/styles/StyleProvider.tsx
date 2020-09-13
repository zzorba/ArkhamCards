import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { EventSubscription } from 'react-native';
import { connect } from 'react-redux';
import { ThemeProvider } from 'react-native-elements';

import StyleContext from './StyleContext';
import { AppState, getLangPreference } from '@reducers';
import { Appearance, ColorSchemeName, AppearancePreferences } from 'react-native-appearance';
import { DARK_THEME, LIGHT_THEME } from './theme';

interface OwnProps {
  children: React.ReactNode;
}

interface ReduxProps {
  lang: string;
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

export let RECENT_FONT_SCALE = 1.0;

class StyleProvider extends React.Component<Props, State> {
  state = {
    colorScheme: Appearance.getColorScheme(),
    fontScale: RECENT_FONT_SCALE,
  };

  _changeListener?: EventSubscription;

  _appearanceChanged = (preferences: AppearancePreferences) => {
    this.setState({
      colorScheme: preferences.colorScheme,
    });
  }

  componentDidMount() {
    this._changeListener = Appearance.addChangeListener(this._appearanceChanged);
    DeviceInfo.getFontScale().then(fontScale => {
      RECENT_FONT_SCALE = fontScale;
      this.setState({
        fontScale,
      });
    });
  }

  componentWillUnmount() {
    this._changeListener && this._changeListener.remove();
  }

  render() {
    const { lang } = this.props;
    const { colorScheme, fontScale } = this.state;
    const darkMode = colorScheme === 'dark';
    return (
      <StyleContext.Provider value={{
        darkMode,
        fontScale,
        colors: darkMode ? DARK_THEME : LIGHT_THEME,
        gameFont: lang === 'ru' ? 'Conkordia' : 'Teutonic',
      }}>
        <ThemeProvider theme={darkMode ? DARK_ELEMENTS_THEME : LIGHT_ELEMENTS_THEME}>
          { this.props.children }
        </ThemeProvider>
      </StyleContext.Provider>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    lang: getLangPreference(state),
  };
}

export default connect(mapStateToProps)(StyleProvider);