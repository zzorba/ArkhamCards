import { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import React from 'react';

const DIVIDE_REGEX = new RegExp('^(.*?)\\[(.*?)\\](.*)$');

export default function TextWithIcons({ text, color, size = 28 }: { text: string; color: string; size: number | undefined }) {
  const match = text.match(DIVIDE_REGEX);
  if (match) {
    return (
      <>
        { match[1] }
        <ArkhamSlimIcon name={match[2]} size={size} color={color} />
        { !!match[3] && <TextWithIcons text={match[3]} color={color} size={size} /> }
      </>
    );
  }
  return <>{text}</>;
}