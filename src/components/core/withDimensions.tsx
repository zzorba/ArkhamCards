import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { Dimensions, ScaledSize } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export interface DimensionsProps {
  width: number;
  height: number;
  fontScale: number;
}

let RECENT_FONT_SCALE = 1.0;

export default function withDimensions<P>(
  WrappedComponent: React.ComponentType<P & DimensionsProps>
): React.ComponentType<P> {
  interface State {
    width: number;
    height: number;
    fontScale: number;
  }

  class DimensionsComponent extends React.Component<P, State> {
    constructor(props: P) {
      super(props);

      const { width, height } = Dimensions.get('window');
      this.state = {
        width,
        height,
        fontScale: RECENT_FONT_SCALE,
      };
    }

    componentDidMount() {
      Dimensions.addEventListener('change', this._onChange);
      DeviceInfo.getFontScale().then(fontScale => {
        RECENT_FONT_SCALE = fontScale;
        this.setState({
          fontScale,
        });
      });
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
      const { width, height, fontScale } = this.state;
      return (
        <WrappedComponent
          {...this.props as P}
          fontScale={fontScale}
          width={width}
          height={height}
        />
      );
    }
  }
  hoistNonReactStatic(DimensionsComponent, WrappedComponent);

  return DimensionsComponent;
}
