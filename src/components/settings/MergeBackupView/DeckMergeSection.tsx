import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { map, sumBy } from 'lodash';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import DeckMergeItem from './DeckMergeItem';
import { Deck } from '@actions/types';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';
import { CardsMap } from '@data/Card';

interface Props {
  title: string;
  decks: Deck[];
  values: { [id: string]: boolean | undefined };
  inverted?: boolean;
  onValueChange: (deck: Deck, value: boolean) => void;
  investigators: CardsMap;
  scenarioCount: {
    [key: string]: number;
  };
}

interface State {
  open: boolean;
}
export default class DeckMergeSection extends React.Component<Props, State> {
  state: State = {
    open: false,
  };

  renderItems() {
    const { decks, inverted, scenarioCount, onValueChange, values, investigators } = this.props;
    return (
      <>
        { map(decks, deck => (
          <DeckMergeItem
            key={deck.uuid || deck.id}
            deck={deck}
            investigators={investigators}
            inverted={!!inverted}
            value={!!values[deck.id]}
            onValueChange={onValueChange}
            scenarioCount={scenarioCount[deck.id] || 1}
          />
        )) }
      </>
    );
  }

  _toggleOpen = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  renderHeader() {
    const { title, decks, values, inverted } = this.props;
    const { open } = this.state;
    const selected = sumBy(decks, deck => {
      if (inverted) {
        return values[deck.id] ? 0 : 1;
      }
      return values[deck.id] ? 1 : 0;
    });
    return (
      <View style={[styles.headerRow, space.paddingS, space.paddingLeftM]}>
        <Text style={typography.label}>
          { title } ({selected} / {decks.length})
        </Text>
        { !inverted && (
          <View style={[styles.icon, space.marginSideS]}>
            <MaterialIcons
              name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={COLORS.darkText}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const { decks, inverted } = this.props;
    const { open } = this.state;
    if (!decks.length) {
      return null;
    }
    if (!inverted) {
      return (
        <>
          <TouchableOpacity onPress={this._toggleOpen}>
            { this.renderHeader() }
          </TouchableOpacity>
          <Collapsible collapsed={!open}>
            { this.renderItems() }
          </Collapsible>
        </>
      );
    }
    return (
      <>
        { this.renderHeader() }
        { this.renderItems() }
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.veryVeryLightBackground,
    borderColor: COLORS.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
