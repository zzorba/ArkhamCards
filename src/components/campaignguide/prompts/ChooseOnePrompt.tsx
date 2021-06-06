import React, { useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { t } from 'ttag';

import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { DisplayChoice } from '@data/scenario';
import space, { s } from '@styles/space';
import { forEach, throttle } from 'lodash';
import InputWrapper from './InputWrapper';
import ActionButton from './ActionButton';
import ChaosBagLine from '@components/core/ChaosBagLine';
import { ChaosBag } from '@app_constants';
import StyleContext from '@styles/StyleContext';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  confirmText?: string;
  showUndo?: boolean;
  choices: DisplayChoice[];
  largePrompt?: boolean;
}

interface State {
  selectedChoice?: number;
}

export default function ChooseOnePrompt({
  id,
  bulletType,
  text,
  confirmText,
  choices,
  showUndo,
}: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { colors, width } = useContext(StyleContext);
  const [currentSelectedChoice, setSelectedChoice] = useState<number | undefined>();

  const undo = useMemo(() => throttle(() => {
    scenarioState.undo();
  }, 500, { leading: true, trailing: false }), [scenarioState]);
  const save = useCallback(() => {
    if (currentSelectedChoice !== undefined) {
      scenarioState.setChoice(id, currentSelectedChoice);
    }
  }, [id, currentSelectedChoice, scenarioState]);

  const decision = scenarioState.choice(id);
  const selectedChoice = decision !== undefined ? decision : currentSelectedChoice;
  const prompt = (decision === undefined ? text : confirmText) || text || t`The investigators must decide (choose one):`;
  const selectedChaosBag = useMemo(() => {
    const selectedTokens = selectedChoice !== undefined ? choices[selectedChoice]?.tokens : undefined;
    if (!selectedTokens) {
      return undefined;
    }
    const chaosBag: ChaosBag = {};
    forEach(selectedTokens, t => {
      chaosBag[t] = (chaosBag[t] || 0) + 1;
    });
    return chaosBag;
  }, [selectedChoice, choices]);
  const editable = decision === undefined;

  const chaosBagLine = useMemo(() => {
    if (!selectedChaosBag) {
      return null;
    }
    return (
      <View style={[
        space.paddingBottomS,
        editable ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined,
      ]}>
        <ChaosBagLine
          chaosBag={selectedChaosBag}
          width={width - s * (editable ? 4 : 2)}
          extraTiny={!editable}
        />
      </View>
    )
  }, [editable, colors, selectedChaosBag, width]);
  return (
    <>
      <InputWrapper
        bulletType={bulletType || 'default'}
        title={confirmText ? prompt : undefined}
        titleNode={confirmText ? undefined : <View style={{ flex: 1 }}><CampaignGuideTextComponent text={prompt} /></View>}
        titleButton={(showUndo && editable) ? (
          <ActionButton
            color="light"
            leftIcon="undo"
            title={t`Undo`}
            onPress={undo}
          />
        ) : undefined}
        editable={editable}
        disabledText={selectedChoice === undefined ? t`Continue` : undefined} onSubmit={save}
      >
        { editable && chaosBagLine }
        <View style={[space.paddingTopS, space.paddingBottomS]}>
          <ChooseOneListComponent
            choices={choices}
            selectedIndex={selectedChoice}
            onSelect={setSelectedChoice}
            editable={decision === undefined}
          />
        </View>
        { !editable && chaosBagLine }
      </InputWrapper>
    </>
  );
}
