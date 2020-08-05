import React from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, StyleSheet } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import ScenarioStepContext, { ScenarioStepContextType } from '@components/campaignguide/ScenarioStepContext';
import { m, s } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  id: string;
  prompt?: string;
}

interface State {
  text: string;
}

export default class TextBoxInputComponent extends React.Component<Props, State> {
  state: State = {
    text: '',
  };

  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  _submit = (
    { nativeEvent: { text } }: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    this.saveText(text);
  };

  _onChangeText = (text: string) => {
    this.setState({
      text,
    });
  };

  _save = () => {
    this.saveText(this.state.text);
  };

  saveText(text: string) {
    const { id } = this.props;
    if (text) {
      this.context.scenarioState.setText(id, text);
    }
  }

  render() {
    const { id, prompt } = this.props;
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState }: ScenarioStepContextType) => {
          const text = scenarioState.text(id);
          if (text !== undefined) {
            return null;
          }
          return (
            <>
              <SetupStepWrapper>
                { !!prompt && <CampaignGuideTextComponent text={prompt} /> }
                <TextInput
                  style={styles.textInput}
                  onChangeText={this._onChangeText}
                  onSubmitEditing={this._submit}
                  returnKeyType="done"
                />
              </SetupStepWrapper>
              <BasicButton
                title={t`Proceed`}
                onPress={this._save}
                disabled={!this.state.text}
              />
            </>
          );
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: s,
    marginRight: m,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 4,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    color: COLORS.darkText,
  },
});
