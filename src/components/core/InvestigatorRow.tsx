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
import { FACTION_COLORS } from 'constants';
import typography from 'styles/typography';

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
          <View style={styles.icon}>
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
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  icon: {
    marginRight: 16,
  },
  image: {
    margin: 8,
  },
  titleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 5,
    marginTop: 4,
    marginBottom: 4,
  },
  buttonColumn: {
    alignSelf: 'flex-start',
  },
  title: {
    color: '#222',
  },
});
