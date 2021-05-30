import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';
import ActionButton from './ActionButton';

interface Props {
  editable: boolean;
  title: string;
  titleNode?: React.ReactNode;
  buttons?: React.ReactNode;
  onSubmit?: () => void;
  disabledText?: string;
  children: React.ReactNode;
}

function TitleRow({ title, titleNode, editable }: { title: string; titleNode?: React.ReactNode; editable?: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={[
      styles.row,
      space.paddingXs,
      titleNode ? styles.spaceBetween : undefined,
      editable ? { marginLeft: xs, marginRight: xs, borderBottomWidth: 1, borderColor: colors.L10 } : undefined,
      space.marginBottomS,
    ]}>
      <Text style={typography.mediumGameFont}>{title}</Text>
      { !!titleNode && titleNode }
    </View>
  );
}

function ButtonRow({ buttons, onSubmit, disabledText }: { buttons?: React.ReactNode; onSubmit?: () => void; disabledText?: string; }) {
  const { colors } = useContext(StyleContext);
  if (!onSubmit && !buttons) {
    return null;
  }
  return (
    <View style={[
      styles.row,
      space.marginXs,
      buttons ? styles.spaceBetween : styles.flexEnd,
      { borderTopWidth: 1, borderColor: colors.L10 },
      space.paddingTopS,
      space.marginBottomL,
    ]}>
      { !!buttons && <View style={space.paddingRightS}>{buttons}</View> }
      { !!onSubmit ? (
        <ActionButton
          title={disabledText || t`Continue`}
          color="dark"
          onPress={onSubmit}
          disabled={!!disabledText}
          rightIcon="right-arrow"
        />
      ) : (
        <View style={space.paddingS} />
      ) }
    </View>
  );
}

export default function InputWrapper({ children, editable, title, titleNode, buttons, onSubmit, disabledText }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  if (editable) {
    return (
      <View style={[styles.container, space.paddingS, space.marginS, shadow.large, { backgroundColor: colors.L20 }]}>
        <TitleRow title={title} titleNode={titleNode} editable={editable} />
        { children }
        <ButtonRow buttons={buttons} onSubmit={onSubmit} disabledText={disabledText} />
      </View>
    );
  }
  return (
    <View style={space.paddingS}>
      <TitleRow title={title} titleNode={titleNode} />
      { children }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
});
