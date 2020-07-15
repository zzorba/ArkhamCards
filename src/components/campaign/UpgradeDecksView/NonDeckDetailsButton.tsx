import React from 'react';
import { Text, View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import BasicListRow from '@components/core/BasicListRow';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import CardSectionHeader from '@components/core/CardSectionHeader';
import Card from '@data/Card';
import typography from '@styles/typography';

interface Props {
  investigator: Card;
  fontScale: number;
  saved: boolean;
  saveXp: (investigator: Card, xp: number) => void;
}

interface State {
  xp: number;
}

export default class NonDeckDetailsButton extends React.Component<Props, State> {
  state: State = {
    xp: 0,
  };

  _incXp = () => {
    this.setState(state => {
      return { xp: (state.xp || 0) + 1 };
    });
  };

  _decXp = () => {
    this.setState(state => {
      return { xp: Math.max((state.xp || 0) - 1, 0) };
    });
  };

  _save = () => {
    const { investigator, saveXp } = this.props;
    const { xp } = this.state;
    saveXp(investigator, xp);
  };

  render() {
    const { investigator, fontScale, saved } = this.props;
    const { xp } = this.state;
    const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
    return (
      <View>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Experience points` }}
        />
        <BasicListRow>
          <Text style={typography.text}>
            { xpString }
          </Text>
          { !saved && (
            <PlusMinusButtons
              count={this.state.xp}
              onIncrement={this._incXp}
              onDecrement={this._decXp}
            />
          ) }
        </BasicListRow>
        { !saved && <BasicButton title={t`Save XP`} onPress={this._save} /> }
      </View>
    );
  }
}