import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface TabooSetOverrideProps {
  tabooSetOverride?: number;
  setTabooSet: (tabooSetId?: number) => void;
}

export default function withTabooSetOverride<Props>(
  WrappedComponent: React.ComponentType<Props & TabooSetOverrideProps>
): React.ComponentType<Props> {
  interface State {
    tabooSetId?: number;
  }
  class TabooSetOverrideComponent extends React.Component<Props, State> {
    state: State = {}

    _setTabooSet = (tabooSetId?: number) => {
      this.setState({
        tabooSetId,
      });
    };
    render() {
      const { tabooSetId } = this.state;
      return (
        <WrappedComponent
          {...this.props}
          tabooSetOverride={tabooSetId}
          setTabooSet={this._setTabooSet}
        />
      );
    }
  }
  hoistNonReactStatic(TabooSetOverrideComponent, WrappedComponent);
  return TabooSetOverrideComponent;
}
