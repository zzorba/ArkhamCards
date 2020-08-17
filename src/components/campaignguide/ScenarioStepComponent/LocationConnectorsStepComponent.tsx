import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { map } from 'lodash';

import SetupStepWrapper from '../SetupStepWrapper';
import { LocationConnectorsStep, LocationConnector } from '@data/scenario/types';
import AppIcon from '@icons/AppIcon';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';

interface Props {
  step: LocationConnectorsStep;
}

const ICON_SIZE = 48;
export default class LocationConnectorsStepComponent extends React.Component<Props> {
  renderLocationConnector(connector: LocationConnector) {
    switch (connector) {
      case 'blue_triangle':
        return <AppIcon name="triangle" color="rgb(37,63,95)" size={ICON_SIZE} />;
      case 'orange_heart':
        return <AppIcon name="heart" color="rgb(173,88,39)" size={ICON_SIZE} />;
      case 'green_diamond':
        return <AppIcon name="diamond" color="rgb(66,114,50)" size={ICON_SIZE} />;
      case 'red_square':
        return <AppIcon name="square" color="rgb(136,22,36)" size={ICON_SIZE} />;
      case 'purple_moon':
        return <AppIcon name="moon" color="rgb(89,39,61)" size={ICON_SIZE} />;
    }
  }

  render() {
    const { step } = this.props;
    return (
      <SetupStepWrapper bulletType={step.bullet_type}>
        <CampaignGuideTextComponent text={step.text} />
        <SetupStepWrapper bulletType={step.bullet_type} reverseSpacing>
          <View style={[styles.iconPile, space.marginTopM, space.marginBottomS]}>
            { map(step.location_connectors, connector => (
              <View style={[space.marginSideS, space.marginBottomM, styles.icon]} key={connector}>
                <View style={styles.iconBackground} />
                { this.renderLocationConnector(connector) }
              </View>
            )) }
          </View>
        </SetupStepWrapper>
        <CampaignGuideTextComponent text={step.subtext} />
      </SetupStepWrapper>
    );
  }
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
