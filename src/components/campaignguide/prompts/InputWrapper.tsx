import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';
import ActionButton from './ActionButton';
import { BulletType } from '@data/scenario/types';
import SetupStepWrapper from '../SetupStepWrapper';

interface Props {
  bulletType?: BulletType;
  editable: boolean;
  title?: string;
  titleNode?: React.ReactNode;
  buttons?: React.ReactNode;
  onSubmit?: () => void;
  disabledText?: string;
  children: React.ReactNode;
}

function TitleRow({ title, titleNode, editable, bulletType }: { bulletType?: BulletType; title?: string; titleNode?: React.ReactNode; editable?: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  const content = useMemo(() => {
    if (!title && !titleNode) {
      return null;
    }
    if (bulletType) {
      return (
        <SetupStepWrapper bulletType={bulletType} noPadding={editable}>
          { !!title && <Text style={typography.bigGameFont}>{title}</Text> }
          { !!titleNode && titleNode }
        </SetupStepWrapper>
      );
    }
    return (
      <>
        { !!title && <Text style={typography.bigGameFont}>{title}</Text> }
        { !!titleNode && titleNode }
      </>
    );
  }, [title, titleNode, editable, bulletType, typography]);
  if (!content) {
    return null;
  }
  return (
    <View style={[
      styles.row,
      (editable || !bulletType) ? space.paddingXs : undefined,
      (titleNode && title) ? styles.spaceBetween : undefined,
      editable ? { marginLeft: xs, marginRight: xs, borderBottomWidth: 1, borderColor: colors.L10 } : undefined,
    ]}>
      { content }
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
      (buttons && onSubmit) ? styles.spaceBetween : styles.flexEnd,
      { borderTopWidth: 1, borderColor: colors.L10 },
      space.paddingTopXs,
      space.marginXs,
    ]}>
      { !!buttons && <View style={!!onSubmit ? space.paddingRightS : undefined}>{buttons}</View> }
      { !!onSubmit && (
        <ActionButton
          title={disabledText || t`Continue`}
          color="dark"
          onPress={onSubmit}
          disabled={!!disabledText}
          rightIcon="right-arrow"
        />
      ) }
    </View>
  );
}

export default function InputWrapper({ children, bulletType, editable, title, titleNode, buttons, onSubmit, disabledText }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  if (editable) {
    return (
      <View
        style={[
          styles.container,
          space.marginS,
          shadow.large,
          space.marginBottomL,
          { backgroundColor: colors.L20 },
        ]}>
        <TitleRow bulletType={bulletType} title={title} titleNode={titleNode} editable={editable} />
        <View style={[space.paddingSideS, space.paddingTopS, space.paddingBottomXs]}>{ children }</View>
        <ButtonRow buttons={buttons} onSubmit={onSubmit} disabledText={disabledText} />
      </View>
    );
  }
  return (
    <View style={bulletType ? undefined : space.paddingS}>
      <TitleRow bulletType={bulletType} title={title} titleNode={titleNode} />
      <View style={bulletType ? space.paddingSideS : undefined}>{ children }</View>
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
