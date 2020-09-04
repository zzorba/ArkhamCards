import React from 'react';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { getLangPreference, AppState } from '@reducers';

export interface StylesProps {
  gameFont: string;
}

export default function withStyles<P>(
  WrappedComponent: React.ComponentType<P & StylesProps>
): React.ComponentType<P> {
  interface ReduxProps {
    lang: string;
  }
  class StylesComponent extends React.Component<P & ReduxProps> {
    render() {
      const { lang } = this.props;
      return (
        <WrappedComponent
          {...this.props as P}
          gameFont={lang === 'ru' ? 'Conkordia' : 'Teutonic'}
        />
      );
    }
  }
  hoistNonReactStatic(StylesComponent, WrappedComponent);

  function mapStateToProps(state: AppState): ReduxProps {
    return {
      lang: getLangPreference(state),
    };
  }
  // @ts-ignore
  return connect<ReduxProps, null, P, AppState>(mapStateToProps)(StylesComponent);
}
