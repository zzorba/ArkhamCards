import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';

import { TouchableOpacity } from '@components/core/Touchables';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardCostIcon from '@components/core/CardCostIcon';
import InvestigatorImage from '@components/core/InvestigatorImage';
import space, { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import AppIcon from '@icons/AppIcon';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  superTitle?: string;
  investigator?: CampaignInvestigator;
  yithian?: boolean;
  description?: string;
  eliminated?: boolean;
  button?: React.ReactNode;
  bigImage?: boolean;
  onPress?: (card: CampaignInvestigator) => void;
  onRemove?: (card: CampaignInvestigator) => void;
  children?: React.ReactNode;
  noFactionIcon?: boolean;
}

const ICON_SIZE = 60;
export default function InvestigatorRow({
  superTitle,
  investigator,
  yithian,
  description,
  eliminated,
  button,
  bigImage,
  onPress,
  onRemove,
  children,
  noFactionIcon,
}: Props) {
  const { colon } = useContext(LanguageContext);
  const { backgroundStyle, borderStyle, colors, fontScale, typography } = useContext(StyleContext);
  const handleOnPress = useCallback(() => {
    onPress && investigator && onPress(investigator);
  }, [onPress, investigator]);
  const handleOnRemove = useCallback(() => {
    onRemove && investigator && onRemove(investigator);
  }, [onRemove, investigator]);

  const backgroundColor = useMemo(() => {
    if (eliminated) {
      return colors.faction.dead.background;
    }
    return colors.faction[investigator ? investigator.card.factionCode() : 'neutral'].background;
  }, [eliminated, investigator, colors]);
  const fadeAnim = useCallback((props: any) => {
    return <Fade {...props} style={{ backgroundColor: colors.M }} duration={1000} />;
  }, [colors]);
  const detailFadeAnim = useCallback((props: any) => {
    return <Fade {...props} style={{ backgroundColor: colors.L20 }} duration={1000} />;
  }, [colors]);
  const content = useMemo(() => {
    return (
      <View style={[
        styles.wrapper,
        backgroundStyle,
        borderStyle,
      ]}>
        { investigator ? (
          <View style={[
            styles.headerColor,
            { backgroundColor },
          ]} />
        ) : (
          <Placeholder Animation={fadeAnim}>
            <PlaceholderLine noMargin style={styles.headerColor} color={colors.D10} />
          </Placeholder>
        ) }
        { !!superTitle && (
          <View style={[styles.row, space.paddingLeftM, space.paddingTopS]}>
            <Text style={typography.mediumGameFont}>{ superTitle }</Text>
          </View>
        ) }
        <View style={[styles.row, !superTitle ? space.paddingTopS : {}]}>
          <View style={styles.image}>
            <InvestigatorImage
              card={investigator?.card}
              killedOrInsane={eliminated}
              yithian={yithian}
              size={bigImage ? 'large' : 'small'}
              border
            />
          </View>
          <View style={[styles.titleColumn, button ? styles.buttonColumn : {}, noFactionIcon ? space.marginRightM : {}]}>
            { investigator ? (
              <Text style={[
                superTitle ? typography.gameFont : typography.bigGameFont,
                typography.dark,
              ]}>
                { description ? `${investigator.card.name}${colon}${description}` : investigator.card.name }
              </Text>
            ) : (
              <Placeholder Animation={detailFadeAnim}>
                <PlaceholderLine color={colors.L10} height={28 * fontScale * 0.6} width={40} style={{ marginTop: 4, marginBottom: 4 }} />
              </Placeholder>
            ) }
            <View style={styles.buttonRow}>
              { !!button && button }
            </View>
          </View>
          { !noFactionIcon && (
            <View style={space.marginRightM}>
              { !onRemove && investigator && (
                <ArkhamIcon
                  name={CardCostIcon.factionIcon(investigator.card)}
                  size={ICON_SIZE}
                  color={colors.faction[eliminated ? 'dead' : investigator.card.factionCode()].background}
                />
              ) }
            </View>
          ) }
          { !!onRemove && (
            <View style={styles.closeIcon}>
              <TouchableOpacity onPress={handleOnRemove}>
                <AppIcon
                  name="trash"
                  size={26}
                  color={colors.D10}
                />
              </TouchableOpacity>
            </View>
          ) }
        </View>
        { !!children && children }
        { investigator ? (
          <View style={[
            styles.headerColor,
            { backgroundColor },
          ]} />
        ) : (
          <Placeholder Animation={fadeAnim}>
            <PlaceholderLine noMargin style={[styles.headerColor, { borderRadius: 0 }]} color={colors.D10} />
          </Placeholder>
        ) }
      </View>
    );
  }, [
    detailFadeAnim,
    fadeAnim,
    handleOnRemove,
    backgroundColor,
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
    backgroundStyle, borderStyle, colors, typography, fontScale, colon,
  ]);

  if (!onPress) {
    return content;
  }
  return (
    <TouchableOpacity onPress={handleOnPress}>
      { content }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  headerColor: {
    height: 16,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});
