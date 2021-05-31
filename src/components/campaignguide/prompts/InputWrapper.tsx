import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';
import ActionButton from './ActionButton';
import { BulletType } from '@data/scenario/types';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  bulletType?: BulletType;
  editable: boolean;
  title?: string;
  titleNode?: React.ReactNode;
  titleButton?: React.ReactNode;
  titleStyle?: 'setup' | 'header';
  buttons?: React.ReactNode;
  onSubmit?: () => void;
  disabledText?: string;
  children: React.ReactNode;
}

function TitleRow({ title, titleNode, titleStyle, titleButton, editable, bulletType }: { bulletType?: BulletType; titleStyle: 'header' | 'setup'; title?: string; titleNode?: React.ReactNode; titleButton?: React.ReactNode; editable?: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  const elementCount = (title ? 1 : 0) + (titleNode ? 1 : 0) + (titleButton ? 1 : 0);
  const titleText = useMemo(() => {
    if (!title) {
      return null;
    }
    return titleStyle === 'setup' ? <CampaignGuideTextComponent text={title} /> : <Text style={typography.bigGameFont}>{title}</Text>;
  }, [title, titleStyle, typography]);
  const content = useMemo(() => {
    if (!titleText && !titleNode) {
      return null;
    }
    if (bulletType) {
      return (
        <SetupStepWrapper bulletType={bulletType} noPadding={editable}>
          <View style={[styles.row, (elementCount >= 2) ? styles.spaceBetween : undefined]}>
            { titleText }
            { !!titleNode && titleNode }
            { !!titleButton && titleButton }
          </View>
        </SetupStepWrapper>
      );
    }
    return (
      <View style={[styles.row, (elementCount >= 2) ? styles.spaceBetween : undefined]}>
        { titleText }
        { !!titleNode && titleNode }
        { !!titleButton && titleButton }
      </View>
    );
  }, [titleText, titleNode, editable, bulletType, titleButton, elementCount]);
  if (!content) {
    return null;
  }
  return (
    <View style={[
      (editable || !bulletType) ? space.paddingXs : undefined,
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

export default function InputWrapper({ children, bulletType, editable, title, titleStyle='header', titleNode, titleButton, buttons, onSubmit, disabledText }: Props) {
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
        <TitleRow bulletType={bulletType} titleStyle={titleStyle} title={title} titleNode={titleNode} titleButton={titleButton} editable />
        <View style={[space.paddingSideS, space.paddingTopS, space.paddingBottomXs]}>{ children }</View>
        <ButtonRow buttons={buttons} onSubmit={onSubmit} disabledText={disabledText} />
      </View>
    );
  }
  return (
    <View style={bulletType ? undefined : space.paddingS}>
      <TitleRow bulletType={bulletType} titleStyle={titleStyle} title={title} titleNode={titleNode} titleButton={titleButton}/>
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
