import { isBig } from 'styles/space';
import { TINY_PHONE } from 'styles/sizes';

function halfFontScale(fontScale: number) {
  return (fontScale - 1) / 2 + 1;
}
export function rowHeight(fontScale: number) {
  return (isBig ? 58 : 48) * fontScale;
}
export function iconSize(fontScale: number) {
  return (isBig ? 46 : 32) * halfFontScale(fontScale);
}

export const BUTTON_PADDING = 12;
export function buttonWidth(fontScale: number) {
  return 18 * fontScale + 22;
}

export function toggleButtonMode(fontScale: number) {
  return TINY_PHONE || fontScale > 1.3;
}

export default {
  rowHeight,
  iconSize,
  buttonWidth,
  BUTTON_PADDING,
  toggleButtonMode,
};
