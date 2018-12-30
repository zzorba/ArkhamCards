import React from 'react';

import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';

const BAD_ICON_NAMES = {
  Action: 'action',
  'per investigator': 'per_investigator',
  lightning: 'free',
  fast: 'free',
  'auto-fail': 'auto_fail',
};

export default function ArkhamIconNode(node, output, state) {
  const Node = node.name === 'bullet' ? AppIcon : ArkhamIcon;
  return (
    <Node
      key={state.key}
      name={BAD_ICON_NAMES[node.name] || node.name}
      size={16}
      color="#000000"
    />
  );
}
