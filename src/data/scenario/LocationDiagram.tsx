import React from 'react'
import { SvgXml } from 'react-native-svg';

import TheGathering from '../../../assets/locations/core/the_gathering.svg';
import TheMidnightMasks from '../../../assets/locations/core/the_midnight_masks.svg';

interface Props {
  scenario: string;
}

export default function LocationDiagram({ scenario }: Props){
  switch (scenario) {
    case 'the_gathering':
      return <SvgXml xml={TheGathering} width={400} height={400} />;
    case 'the_midnight_masks':
    default:
      return <SvgXml xml={TheMidnightMasks} width={400} height={400} />;
  }
}