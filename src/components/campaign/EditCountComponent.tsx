import React from 'react';
import { debounce } from 'lodash';
import {
  StyleSheet,
  Text,
} from 'react-native';

import withStyles, { StylesProps } from '@components/core/withStyles';
import BasicListRow from '@components/core/BasicListRow';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import typography from '@styles/typography';

interface OwnProps {
  countChanged: (index: number, count: number) => void;
  index: number;
  title: string;
  count?: number;
  isInvestigator?: boolean;
}

interface State {
  count?: number;
}

type Props = OwnProps & StylesProps;

class EditCountComponent extends React.Component<Props, State> {
  _countChanged!: (index: number, count: number) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      count: props.count,
    };

    this._countChanged = debounce(props.countChanged, 200, { trailing: true });
  }

  _increment = () => {
    this.setState(state => {
      const count = (state.count || 0) + 1;
      this._countChanged(this.props.index, count);
      return { count };
    });
  };

  _decrement = () => {
    this.setState(state => {
      const count = Math.max((state.count || 0) - 1, 0);
      this._countChanged(this.props.index, count);
      return { count };
    });
  };

  render() {
    const {
      title,
      gameFont,
    } = this.props;
    const {
      count,
    } = this.state;
    return (
      <BasicListRow>
        <Text style={[typography.mediumGameFont, { fontFamily: gameFont }]}>
          { title }
        </Text>
        <PlusMinusButtons
          count={count || 0}
          onIncrement={this._increment}
          onDecrement={this._decrement}
          countRender={(
            <Text style={[styles.margin, typography.text]}>
              { count }
            </Text>
          )}
          size={36}
        />
      </BasicListRow>
    );
  }
}

export default withStyles(EditCountComponent);

const styles = StyleSheet.create({
  margin: {
    minWidth: 40,
    textAlign: 'center',
  },
});
