import React from 'react';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';

export interface GuideChaosBagProps {
  componentId: string;
  campaignId: number;
  chaosBag: ChaosBag;
}

type Props = NavigationProps & GuideChaosBagProps;

export default class GuideChaosBagView extends React.Component<Props> {
  render() {
    const {
      componentId,
      campaignId,
      chaosBag,
    } = this.props;

    return (
      <DrawChaosBagComponent
        componentId={componentId}
        campaignId={campaignId}
        chaosBag={chaosBag}
      />
    );
  }
}
