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
import typography from 'styles/typography';
import space, { m, s, xs } from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  superTitle?: string;
  investigator: Card;
  yithian?: boolean;
  description?: string;
  eliminated?: boolean;
  button?: React.ReactNode;
  bigImage?: boolean;
  onPress?: (card: Card) => void;
  onRemove?: (card: Card) => void;
  children?: React.ReactElement | React.ReactElement[];
  noFactionIcon?: boolean;
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
      children,
      eliminated,
      button,
      description,
      yithian,
      bigImage,
      noFactionIcon,
      superTitle,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={[
          styles.headerColor,
          { backgroundColor: COLORS.faction[eliminated ? 'dead' : investigator.factionCode()].darkBackground },
        ]} />
        { !!superTitle && (
          <View style={[styles.row, space.paddingLeftM, space.paddingTopS]}>
            <Text style={typography.mediumGameFont}>{ superTitle }</Text>
          </View>
        ) }
        <View style={[styles.row, !superTitle ? space.paddingTopS : {}]}>
          <View style={styles.image}>
            <InvestigatorImage
              card={investigator}
              killedOrInsane={eliminated}
              yithian={yithian}
              small={!bigImage}
              border
            />
          </View>
          <View style={[styles.titleColumn, button ? styles.buttonColumn : {}, noFactionIcon ? space.marginRightM : {}]}>
            <Text style={[superTitle ? typography.gameFont : typography.bigGameFont, styles.title]}>
              { description ? `${investigator.name}: ${description}` : investigator.name }
            </Text>
            { !!button && button }
          </View>
          { !noFactionIcon && (
            <View style={space.marginRightM}>
              { !onRemove && (
                <ArkhamIcon
                  name={CardCostIcon.factionIcon(investigator)}
                  size={ICON_SIZE}
                  color={COLORS.faction[eliminated ? 'dead' : investigator.factionCode()].background}
                />
              ) }
            </View>
          ) }
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
        { !!children && children }
        <View style={[
          styles.headerColor,
          { backgroundColor: COLORS.faction[eliminated ? 'dead' : investigator.factionCode()].darkBackground },
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
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
    color: COLORS.darkText,
  },
  headerColor: {
    height: 16,
  },
});
