import React from 'react';

import TextEntryComponent from './TextEntryComponent';
import SingleCardWrapper from '../../SingleCardWrapper';
import { CampaignLogEntry } from 'data/scenario/GuidedCampaignLog';
import Card from 'data/Card';

interface Props {
  crossedOut?: boolean;
  code: string;
  count: number;
  entry: CampaignLogEntry;
  text?: string;
}

export default class CampaignLogCardEntryComponent extends React.Component<Props> {
  _renderCard = (card: Card) => {
    const { crossedOut, entry, text, count } = this.props;
    return (
      <TextEntryComponent
        text={(text || '#name#').replace('#name#', card.name).replace('#X#', `${count}`)}
        crossedOut={crossedOut}
        entry={entry}
      />
    );
  };

  render() {
    const { code } = this.props;
    return (
      <SingleCardWrapper
        code={code}
        render={this._renderCard}
      />
    );
  }
}
