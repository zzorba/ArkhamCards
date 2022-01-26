import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { showCard } from '@components/nav/helper';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import InvestigatorImage from '@components/core/InvestigatorImage';
import CardTextComponent from '@components/card/CardTextComponent';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import Card from '@data/types/Card';
import { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';

interface Props {
  componentId?: string;
  investigator: Card;
  investigatorBack?: Card;
  tabooSetId: number | undefined;
  yithian?: boolean;
}
export default function InvestigatorSummaryBlock({ investigator, componentId, tabooSetId, yithian, investigatorBack }: Props) {
  const { colors } = useContext(StyleContext);
  const [showBack, toggleShowBack] = useFlag(false);
  const onPress = useCallback(() => {
    if (componentId) {
      if (investigator) {
        showCard(
          componentId,
          investigator.code,
          investigator,
          colors,
          false,
          tabooSetId,
          investigatorBack?.code
        );
      }
    } else {
      toggleShowBack();
    }
  }, [componentId, tabooSetId, investigator, investigatorBack, colors, toggleShowBack]);
  const [textContent, tabooContent] = useMemo(() => {
    if (!investigatorBack || !investigatorBack.back_text || !showBack) {
      return [
        investigator.text ? (
          <View style={[styles.gameTextBlock, styles.headerLeftMargin]} key="text">
            <CardTextComponent
              text={investigator.text}
            />
          </View>
        ) : null,
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
              <InvestigatorStatLine investigator={investigator} />
              { textContent }
            </View>
            { !showBack && (
              <View style={[styles.headerColumn, styles.headerLeftMargin]}>
                <View style={styles.image}>
                  <InvestigatorImage
                    card={investigator}
                    backCard={investigatorBack}
                    componentId={componentId}
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
  }, [investigator, investigatorBack, tabooSetId, componentId, yithian, textContent, tabooContent, showBack]);
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
