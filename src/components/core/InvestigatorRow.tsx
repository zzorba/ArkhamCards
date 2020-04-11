import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import ArkhamIcon from 'icons/ArkhamIcon';
import CardCostIcon from 'components/core/CardCostIcon';
import InvestigatorImage from 'components/core/InvestigatorImage';
import Card from 'data/Card';
import { FACTION_COLORS, FACTION_DARK_GRADIENTS } from 'constants';
import typography from 'styles/typography';
import space, { m, s, xs } from 'styles/space';

interface Props {
  investigator: Card;
  description?: string;
  eliminated?: boolean;
  button?: React.ReactNode;
  detail?: React.ReactNode;
  onPress?: (card: Card) => void;
  onRemove?: (card: Card) => void;
}

const ICON_SIZE = 60;
export default class InvestigatorRow extends React.Component<Props> {
  _onPress = () => {
    const {
      onPress,
      investigator,
    } = this.props;
    onPress && onPress(investigator);
  };

  _onRemove = () => {
    const {
      onRemove,
      investigator,
    } = this.props;
    onRemove && onRemove(investigator);
  };

  renderContent() {
    const {
      investigator,
      onRemove,
      detail,
      eliminated,
      button,
      description,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={[
          styles.headerColor,
          { backgroundColor: FACTION_DARK_GRADIENTS[eliminated ? 'dead' : investigator.factionCode()][0] },
        ]} />
        <View style={styles.row}>
          <View style={styles.image}>
            <InvestigatorImage
              card={investigator}
              killedOrInsane={eliminated}
              small
              border
            />
          </View>
          <View style={[styles.titleColumn, button ? styles.buttonColumn : {}]}>
            <Text style={[typography.bigGameFont, styles.title]}>
              { description ? `${investigator.name}: ${description}` : investigator.name }
            </Text>
            { !!button && button }
          </View>
          <View style={space.marginRightM}>
            { !onRemove && (
              <ArkhamIcon
                name={CardCostIcon.factionIcon(investigator)}
                size={ICON_SIZE}
                color={FACTION_COLORS[eliminated ? 'dead' : investigator.factionCode()]}
              />
            ) }
          </View>
          { !!onRemove && (
            <View style={styles.closeIcon}>
              <TouchableOpacity onPress={this._onRemove}>
                <MaterialCommunityIcons
                  name="close"
                  size={36}
                  color="#222"
                />
              </TouchableOpacity>
            </View>
          ) }
        </View>
        { !!detail && detail }
        <View style={[
          styles.headerColor,
          { backgroundColor: FACTION_DARK_GRADIENTS[eliminated ? 'dead' : investigator.factionCode()][0] },
        ]} />
      </View>
    );
  }

  render() {
    const {
      onPress,
    } = this.props;
    if (!onPress) {
      return this.renderContent();
    }
    return (
      <TouchableOpacity onPress={this._onPress}>
        { this.renderContent() }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#bbb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: s,
  },
  closeIcon: {
    position: 'absolute',
    top: s,
    right: s,
  },
  image: {
    marginTop: s,
    marginLeft: m,
    marginBottom: m,
    marginRight: m,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: xs,
    marginTop: xs,
    marginBottom: xs,
  },
  buttonColumn: {
    alignSelf: 'flex-start',
  },
  title: {
    color: '#222',
  },
  headerColor: {
    height: 16,
  },
});
