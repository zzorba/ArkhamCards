import React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface DimensionsProps {
  width: number;
  height: number;
}

export default function withDimensions<P>(
  WrappedComponent: React.ComponentType<P & DimensionsProps>
): React.ComponentType<P> {
  interface State {
    width: number;
    height: number;
  }

  class DimensionsComponent extends React.Component<P, State> {
    constructor(props: P) {
      super(props);

      const { width, height } = Dimensions.get('window');
      this.state = {
        width,
        height,
      };
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this._onChange);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this._onChange);
    }

    _onChange = ({ window: { width, height } }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      this.setState({
        width,
        height,
      });
    };


    render() {
      const { width, height } = this.state;
      return (
        <WrappedComponent
          {...this.props as P}
          width={width}
          height={height}
        />
      );
    }
  }
  hoistNonReactStatic(DimensionsComponent, WrappedComponent);

  return DimensionsComponent;
}
