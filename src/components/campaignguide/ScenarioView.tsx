import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { last } from 'lodash';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import CampaignGuideContext, { CampaignGuideContextType } from './CampaignGuideContext';
import { ScenarioGuideContextType } from './ScenarioGuideContext';
import StepsComponent from './StepsComponent';
import { CampaignLogProps } from './CampaignLogView';
import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import { iconsMap } from 'app/NavIcons';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';

interface OwnProps {
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}
type InputProps = NavigationProps & ScenarioGuideInputProps & OwnProps;

type Props = InputProps & DimensionsProps & ScenarioGuideContextType;

export type ScenarioProps = ScenarioGuideInputProps & OwnProps;

const RESET_ENABLED = false;

class ScenarioView extends React.Component<Props> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;
  undoEnabled: boolean;

  static get options() {
    return ScenarioView.dynamicOptions(false);
  }

  static dynamicOptions(undo: boolean) {
    const rightButtons = RESET_ENABLED ? [{
      icon: iconsMap.replay,
      id: 'reset',
      color: COLORS.navButton,
    }] : [{
      icon: iconsMap.menu,
      id: 'log',
      color: COLORS.navButton,
    }];
    if (undo) {
      rightButtons.push({
        icon: iconsMap.undo,
        id: 'undo',
        color: COLORS.navButton,
      });
    }
    return {
      topBar: {
        rightButtons,
      },
    };
  }
  _navEventListener: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.undoEnabled = props.processedScenario.canUndo;
    Navigation.mergeOptions(props.componentId, ScenarioView.dynamicOptions(this.undoEnabled));
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidUpdate() {
    const {
      processedScenario: { canUndo },
      componentId,
    } = this.props;
    if (canUndo !== this.undoEnabled) {
      Navigation.mergeOptions(componentId, ScenarioView.dynamicOptions(canUndo));
    }
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    switch (buttonId) {
      case 'reset': {
        this.resetPressed();
        break;
      }
      case 'log': {
        this.menuPressed();
        break;
      }
      case 'undo': {
        this.undoPressed();
        break;
      }
    }
  }

  undoPressed() {
    const {
      componentId,
      scenarioId,
      processedScenario: { closeOnUndo },
    } = this.props;
    this.context.campaignState.undo(scenarioId);
    if (closeOnUndo) {
      Navigation.pop(componentId);
    }
  }

  _switchCampaignScenario = () => {
    const {
      componentId,
      showLinkedScenario,
      processedScenario,
    } = this.props;
    Navigation.pop(componentId).then(() => {
      if (showLinkedScenario) {
        showLinkedScenario(processedScenario.id.encodedScenarioId);
      }
    });
  };

  menuPressed() {
    const { componentId, processedScenario, campaignId } = this.props;
    const log = last(processedScenario.steps);
    if (!log) {
      return;
    }
    Navigation.push<CampaignLogProps>(componentId, {
      component: {
        name: 'Guide.Log',
        passProps: {
          campaignId,
          campaignLog: log.campaignLog,
          campaignGuide: processedScenario.scenarioGuide.campaignGuide,
        },
        options: {
          topBar: {
            title: {
              text: t`Campaign Log`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }

  resetPressed() {
    Alert.alert(
      t`Reset Scenario?`,
      t`Are you sure you want to reset this scenario?\n\nAll data you have entered will be lost.`,
      [{
        text: t`Nevermind`,
      }, {
        text: t`Reset`,
        style: 'destructive',
        onPress: () => {
          this.context.campaignState.resetScenario(this.props.scenarioId);
        },
      }]
    );
  }

  render() {
    const { componentId, fontScale, width, processedScenario } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="position"
        enabled
        keyboardVerticalOffset={100}
      >
        <KeepAwake />
        <ScrollView>
          <StepsComponent
            componentId={componentId}
            fontScale={fontScale}
            width={width}
            steps={processedScenario.steps}
            switchCampaignScenario={this._switchCampaignScenario}
          />
          <View style={styles.footer} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default withScenarioGuideContext<InputProps>(
  withDimensions<InputProps & ScenarioGuideContextType>(ScenarioView)
);

const styles = StyleSheet.create({
  footer: {
    marginTop: 64,
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
});
