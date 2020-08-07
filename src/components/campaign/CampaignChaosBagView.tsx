import React from 'react';
import { connect } from 'react-redux';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import DrawChaosBagComponent from './DrawChaosBagComponent';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';
import COLORS from '@styles/colors';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { AppState, getCampaign } from '@reducers';

export interface CampaignChaosBagProps {
  componentId: string;
  campaignId: number;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

interface ReduxProps {
  chaosBag: ChaosBag;
}

type Props = NavigationProps & CampaignChaosBagProps & ReduxProps;

class CampaignChaosBagView extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        rightButtons: [{
          systemItem: 'save',
          text: t`Edit`,
          id: 'edit',
          showAsAction: 'ifRoom',
          color: COLORS.navButton,
          testID: t`Edit`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const { componentId } = this.props;
    if (buttonId === 'back' || buttonId === 'androidBack') {
      Navigation.pop(componentId);
    } else if (buttonId === 'edit') {
      this._showChaosBagDialog();
    }
  }

  _showChaosBagDialog = () => {
    const {
      componentId,
      chaosBag,
      updateChaosBag,
    } = this.props;
    if (!updateChaosBag) {
      return;
    }
    Navigation.push<EditChaosBagProps>(componentId, {
      component: {
        name: 'Dialog.EditChaosBag',
        passProps: {
          chaosBag,
          updateChaosBag: updateChaosBag,
          trackDeltas: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  };

  render() {
    const {
      componentId,
      campaignId,
      chaosBag,
      trackDeltas,
    } = this.props;

    return (
      <DrawChaosBagComponent
        componentId={componentId}
        campaignId={campaignId}
        chaosBag={chaosBag}
        trackDeltas={trackDeltas}
      />
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CampaignChaosBagProps
): ReduxProps {
  const campaign = getCampaign(state, props.campaignId);
  return {
    chaosBag: (campaign && campaign.chaosBag) || {},
  };
}

export default connect<ReduxProps, unknown, NavigationProps & CampaignChaosBagProps, AppState>(
  mapStateToProps
)(CampaignChaosBagView);
