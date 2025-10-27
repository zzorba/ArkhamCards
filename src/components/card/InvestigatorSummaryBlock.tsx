import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { TouchableOpacity } from '@components/core/Touchables';
import { showCard } from '@components/nav/helper';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import CardTextComponent from '@components/card/CardTextComponent';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import Card from '@data/types/Card';
import { m, s, xs } from '@styles/space';
import { useFlag } from '@components/core/hooks';
import { useNavigation } from '@react-navigation/native';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
  investigatorBack?: Card;
  tabooSetId: number | undefined;
  yithian?: boolean;
  navEnabled: boolean
}
export default function InvestigatorSummaryBlock({ investigator, navEnabled, tabooSetId, yithian, investigatorBack }: Props) {
  const [showBack, toggleShowBack] = useFlag(false);
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => {
    if (navEnabled) {
      if (investigator) {
        showCard(
          navigation,
          investigator.code,
          investigator,
          colors,
          {
            showSpoilers: false,
            tabooSetId,
            backCode: investigatorBack?.code,
          }
        );
      }
    } else {
      toggleShowBack();
    }
  }, [navigation, colors, navEnabled, tabooSetId, investigator, investigatorBack, toggleShowBack]);
  const [textContent, tabooContent] = useMemo(() => {
    if (!investigatorBack || !investigatorBack.back_text || !showBack) {
      return [
        <>
          <InvestigatorStatLine investigator={investigator} />
          { !!investigator.text && (
            <View style={[styles.gameTextBlock, styles.headerLeftMargin]} key="text">
              <CardTextComponent
                text={investigator.text}
              />
            </View>
          ) }
        </>,
        <View style={styles.headerLeftMargin} key="taboo">
          <CardTabooTextBlock card={investigator} />
        </View>,
      ];
    }
    return [
      <View style={[styles.gameTextBlock, styles.headerLeftMargin]} key="text">
        <CardTextComponent
          text={investigatorBack.back_text}
        />
      </View>,
      null,
    ];
  }, [investigatorBack, investigator, showBack]);
  const content = useMemo(() => {
    return (
      <>
        <View>
          <View style={styles.header}>
            <View style={styles.headerTextColumn}>
              { textContent }
            </View>
            { !showBack && (
              <View style={[styles.headerColumn, styles.headerLeftMargin]}>
                <View style={styles.image}>
                  <InvestigatorImage
                    card={investigator}
                    backCard={investigatorBack}
                    yithian={yithian}
                    tabooSetId={tabooSetId}
                    border
                  />
                </View>
                <HealthSanityLine investigator={investigator} />
              </View>
            ) }
          </View>
        </View>
        { tabooContent }
      </>
    );
  }, [investigator, investigatorBack, tabooSetId, yithian, textContent, tabooContent, showBack]);
  return (
    <View style={styles.column}>
      <TouchableOpacity onPress={onPress}>
        { content }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeftMargin: {
    marginLeft: xs,
  },
  header: {
    marginTop: m,
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerTextColumn: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    marginBottom: xs,
  },
  headerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: s,
  },
  column: {
    flex: 1,
  },
  gameTextBlock: {
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
  },
});
