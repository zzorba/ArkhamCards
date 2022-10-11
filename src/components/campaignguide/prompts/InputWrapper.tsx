import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';
import ActionButton from './ActionButton';
import { BorderColor, BulletType } from '@data/scenario/types';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import Card from '@data/types/Card';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import ScenarioGuideContext from '../ScenarioGuideContext';
import { throttle } from 'lodash';

interface Props {
  bulletType?: BulletType;
  investigator?: Card;
  editable: boolean;
  title?: string;
  titleNode?: React.ReactNode;
  titleButton?: React.ReactNode;
  titleStyle?: 'setup' | 'header';
  buttons?: React.ReactNode;
  onSubmit?: () => void;
  disabledText?: string;
  children: React.ReactNode;
  noDivider?: boolean;
}

function TitleRow({ title, titleNode, titleStyle, titleButton, editable, bulletType }: { bulletType?: BulletType; titleStyle: 'header' | 'setup'; title?: string; titleNode?: React.ReactNode; titleButton?: React.ReactNode; editable?: boolean }) {
  const { colors, typography } = useContext(StyleContext);
  const elementCount = (title ? 1 : 0) + (titleNode ? 1 : 0) + (titleButton ? 1 : 0);
  const titleText = useMemo(() => {
    if (!title) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        { titleStyle === 'setup' ? (
          <CampaignGuideTextComponent text={title} />
        ) : (
          <Text style={[typography.bigGameFont, editable ? space.paddingSideXs : undefined]}>
            {title}
          </Text>
        ) }
      </View>
    );
  }, [title, titleStyle, typography, editable]);
  const content = useMemo(() => {
    if (!titleText && !titleNode) {
      return null;
    }
    if (bulletType) {
      return (
        <SetupStepWrapper bulletType={bulletType} noPadding={editable}>
          <View style={[
            styles.row,
            (elementCount >= 2) ? styles.spaceBetween : undefined,
            bulletType === 'small' ? space.paddingSideS : undefined,
          ]}>
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
      editable ? { marginLeft: xs, marginRight: xs, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined,
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
      { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 },
      space.paddingTopXs,
      space.marginXs,
    ]}>
      { !!buttons && <View style={[!!onSubmit ? space.paddingRightS : undefined, { flexShrink: 1 }]}>{buttons}</View> }
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

export default function InputWrapper({
  children,
  investigator,
  bulletType,
  editable,
  title,
  titleStyle = 'header',
  titleNode,
  titleButton,
  buttons,
  onSubmit,
  disabledText,
  noDivider,
}: Props) {
  const { colors, borderStyle, shadow, width } = useContext(StyleContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const undo = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 500, { leading: true, trailing: false }), [scenarioState]);
  const undoButton = editable && !titleButton && (!title || !titleNode) ? (
    <ActionButton
      color="light"
      leftIcon="undo"
      title={t`Undo`}
      onPress={undo}
    />
  ) : undefined;

  if (investigator) {
    return (
      <View style={[space.paddingSideS, space.marginBottomL]}>
        <RoundedFactionBlock
          noSpace
          noShadow={!editable}
          faction={investigator.factionCode()}
          header={<CompactInvestigatorRow investigator={investigator} width={width - s * 2} open />}
        >
          <TitleRow
            bulletType={bulletType}
            titleStyle={titleStyle}
            title={title}
            titleNode={titleNode}
            titleButton={editable ? (titleButton || undoButton) : undefined}
            editable={editable}
          />
          <View style={[space.paddingSideS, space.paddingTopS, space.paddingBottomXs]}>{ children }</View>
          { editable && <ButtonRow buttons={buttons} onSubmit={onSubmit} disabledText={disabledText} /> }
        </RoundedFactionBlock>
      </View>
    );
  }
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
        <TitleRow bulletType={bulletType} titleStyle={titleStyle} title={title} titleNode={titleNode} titleButton={titleButton || undoButton} editable />
        <View style={[space.paddingSideS, space.paddingTopS, space.paddingBottomXs]}>{ children }</View>
        <ButtonRow buttons={buttons} onSubmit={onSubmit} disabledText={disabledText} />
      </View>
    );
  }
  return (
    <View style={[
      bulletType ? undefined : space.paddingS,
    ]}>
      <TitleRow bulletType={bulletType} titleStyle={titleStyle} title={title} titleNode={titleNode} titleButton={titleButton} />
      <View style={bulletType ? space.paddingSideS : undefined}>{ children }</View>
      <View style={[bulletType ? space.marginSideS : undefined, noDivider ? undefined : { borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]} />
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
