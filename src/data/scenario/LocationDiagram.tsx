import React from 'react'
import { SvgXml } from 'react-native-svg';

import ReturnToTheGathering from '../../../assets/locations/core/return_to_the_gathering.svg';
import TheMidnightMasks from '../../../assets/locations/core/the_midnight_masks.svg';
import BloodOnTheAlatar from '../../../assets/locations/dwl/blood_on_the_altar.svg';
import ExtracurricularActivity from '../../../assets/locations/dwl/extracurricular_activity.svg';
import ReturnToBloodOnTheAlatar from '../../../assets/locations/dwl/return_to_blood_on_the_altar.svg';
import TheEssexCountyExpress from '../../../assets/locations/dwl/the_essex_county_express.svg';
import TheHouseAlwaysWins from '../../../assets/locations/dwl/the_house_always_wins.svg'
import UndimensionsedAndUnseen from '../../../assets/locations/dwl/undimensioned_and_unseen.svg';
import WhereDoomAwaits from '../../../assets/locations/dwl/where_doom_awaits.svg'

interface Props {
  name: string;
}

const FILES: { [key: string]: any } = {
  return_to_the_gathering: ReturnToTheGathering,
  the_midnight_masks: TheMidnightMasks,
  blood_on_the_altar: BloodOnTheAlatar,
  return_to_blood_on_the_altar: ReturnToBloodOnTheAlatar,
  extracurricular_activity: ExtracurricularActivity,
  the_essex_county_express: TheEssexCountyExpress,
  the_house_always_wins: TheHouseAlwaysWins,
  undimensioned_and_unseen: UndimensionsedAndUnseen,
  where_doom_awaits: WhereDoomAwaits,
}

export default class LocationDiagram extends React.Component<Props> {
  svg() {
    const { name } = this.props;
    return FILES[name];
  }

  render() {
    return (
      <SvgXml xml={this.svg()} />
    );
  }
}