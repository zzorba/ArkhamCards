import React from 'react';
import {
  View,
} from 'react-native';
import DialogComponent from '@lib/react-native-dialog';

import DialogPlusMinusButtons from '@components/core/DialogPlusMinusButtons';
import { t } from 'ttag';
import { Trauma } from '@actions/types';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import typography from '@styles/typography';

interface Props {
  investigator?: Card;
  trauma: Trauma;
  mutateTrauma: (updateTrauma: (trauma: Trauma) => Trauma) => void;
  hideKilledInsane?: boolean;
}
export default class EditTraumaDialogContent extends React.Component<Props> {
  _incPhysical = () => {
    const {
      investigator,
    } = this.props;
    const health = investigator ? (investigator.health || 0) : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.min((trauma.physical || 0) + 1, health) })
    );
  };

  _decPhysical = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { physical: Math.max((trauma.physical || 0) - 1, 0) })
    );
  };

  _incMental = () => {
    const {
      investigator,
    } = this.props;
    const sanity = investigator ? (investigator.sanity || 0) : 0;
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.min((trauma.mental || 0) + 1, sanity) })
    );
  };

  _decMental = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { mental: Math.max((trauma.mental || 0) - 1, 0) })
    );
  };

  _toggleKilled = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { killed: !trauma.killed })
    );
  };

  _toggleInsane = () => {
    this.props.mutateTrauma(trauma =>
      Object.assign({}, trauma, { insane: !trauma.insane })
    );
  };

  render() {
    const {
      investigator,
      trauma: {
        killed,
        insane,
        physical,
        mental,
      },
      hideKilledInsane,
    } = this.props;
    const health = investigator ? (investigator.health || 0) : 0;
    const sanity = investigator ? (investigator.sanity || 0) : 0;

    const impliedKilled = (physical === health);
    const impliedInsane = (mental === sanity);
    return (
      <View>
        <DialogPlusMinusButtons
          label={t`Physical Trauma`}
          value={physical || 0}
          inc={this._incPhysical}
          dec={this._decPhysical}
          max={health}
        />
        <DialogPlusMinusButtons
          label={t`Mental Trauma`}
          value={mental || 0}
          inc={this._incMental}
          dec={this._decMental}
          max={sanity}
        />
        { !hideKilledInsane && (
          <DialogComponent.Switch
            label={t`Killed`}
            labelStyle={typography.dialogLabel}
            value={killed || impliedKilled}
            disabled={impliedKilled}
            onValueChange={this._toggleKilled}
            trackColor={COLORS.switchTrackColor}
          />
        ) }
        { !hideKilledInsane && (
          <DialogComponent.Switch
            label={t`Insane`}
            labelStyle={typography.dialogLabel}
            value={insane || impliedInsane}
            disabled={impliedInsane}
            onValueChange={this._toggleInsane}
            trackColor={COLORS.switchTrackColor}
          />
        ) }
      </View>
    );
  }
}
