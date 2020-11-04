import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { map, sumBy } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DeckMergeItem from './DeckMergeItem';
import { Deck } from '@actions/types';
import space from '@styles/space';
import { CardsMap } from '@data/Card';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
  static contextType = StyleContext;
  context!: StyleContextType;

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
    const { colors, borderStyle, typography } = this.context;
    const selected = sumBy(decks, deck => {
      if (inverted) {
        return values[deck.id] ? 0 : 1;
      }
      return values[deck.id] ? 1 : 0;
    });
    return (
      <View style={[styles.headerRow, { backgroundColor: colors.L10 }, borderStyle, space.paddingS, space.paddingLeftM]}>
        <Text style={typography.small}>
          { title } ({selected} / {decks.length})
        </Text>
        { !inverted && (
          <View style={[styles.icon, space.marginSideS]}>
            <MaterialIcons
              name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.darkText}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
