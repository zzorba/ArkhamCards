import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { map } from 'lodash';

import SetupStepWrapper from '../SetupStepWrapper';
import { LocationConnectorsStep, LocationConnector } from '@data/scenario/types';
import LocationConnectorIcon from '@icons/LocationConnectorIcon';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';

interface Props {
  step: LocationConnectorsStep;
}

const ICON_SIZE = 48;

export default function LocationConnectorsStepComponent({ step }: Props) {
  return (
    <SetupStepWrapper bulletType={step.bullet_type}>
      <CampaignGuideTextComponent text={step.text} />
      <SetupStepWrapper bulletType={step.bullet_type} reverseSpacing>
        <View style={[styles.iconPile, space.marginTopM, space.marginBottomS]}>
          { map(step.location_connectors, connector => (
            <View key={connector} style={[space.marginSideS, space.marginBottomM]}>
              <LocationConnectorIcon connector={connector} size={ICON_SIZE} />
            </View>
          )) }
        </View>
      </SetupStepWrapper>
      <CampaignGuideTextComponent text={step.subtext} />
    </SetupStepWrapper>
  );
}

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  icon: {
    position: 'relative',
  },
  iconBackground: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: ICON_SIZE - 2,
    height: ICON_SIZE - 2,
    backgroundColor: 'white',
    borderRadius: (ICON_SIZE / 2) - 1,
  },
});
