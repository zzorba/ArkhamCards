import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Results } from 'realm';
import { t } from 'ttag';
import DialogComponent from 'react-native-dialog';

import TabooSetDialogOptions from '../TabooSetDialogOptions';
import Dialog from '../core/Dialog';
import PlusMinusButtons from '../core/PlusMinusButtons';
import TabooSet from '../../data/TabooSet';
import { COLORS } from '../../styles/colors';
import space, { m } from '../../styles/space';
import typography from '../../styles/typography';

interface Props {
  tabooSets: Results<TabooSet>;
  name: string;
  tabooSetId?: number;
  xp: number;
  spentXp: number;
  xpAdjustment: number;
  xpAdjustmentEnabled: boolean;
  visible: boolean;
  viewRef?: View;
  toggleVisible: () => void;
  updateDetails: (name: string, tabooSetId: number, xpAdjustment: number) => void;
}

interface State {
  name: string;
  tabooSetId?: number;
  xpAdjustment: number;
  saving: boolean;
}

export default class EditDeckDetailsDialog extends React.Component<Props, State> {
  state: State = {
    name: '',
    xpAdjustment: 0,
    saving: false,
  };
  _textInputRef?: TextInput;

  componentDidUpdate(prevProps: Props) {
    const {
      visible,
      name,
      tabooSetId,
      xpAdjustment,
    } = this.props;
    if (visible && !prevProps.visible) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        name,
        tabooSetId,
        xpAdjustment,
      });
    }
  }

  _incXp = () => {
    this.setState((state) => {
      return {
        xpAdjustment: state.xpAdjustment + 1,
      };
    });
  };

  _decXp = () => {
    this.setState((state) => {
      return {
        xpAdjustment: state.xpAdjustment - 1,
      };
    });
  };

  _onDeckNameChange = (name: string) => {
    this.setState({
      name,
    });
  }

  _captureTextInputRef = (ref: TextInput) => {
    this._textInputRef = ref;
  };

  _onOkayPress = () => {
    const {
      name,
      tabooSetId,
      xpAdjustment,
    } = this.state;
    this.props.updateDetails(name, tabooSetId || 0, xpAdjustment);
  }

  _setTabooSetId = (tabooSetId?: number) => {
    this.setState({
      tabooSetId,
    });
  }

  xpString() {
    const {
      xp,
      spentXp,
    } = this.props;
    const {
      xpAdjustment,
    } = this.state;
    const adjustedExperience = xp + xpAdjustment;
    if (xpAdjustment !== 0) {
      const adjustment = xpAdjustment > 0 ? `+${xpAdjustment}` : xpAdjustment;
      return t`XP: ${spentXp} of ${adjustedExperience} (${adjustment})`;
    }
    return t`XP: ${spentXp} of ${adjustedExperience} (+0)`;
  }

  render() {
    const {
      toggleVisible,
      visible,
      viewRef,
      tabooSets,
      xpAdjustmentEnabled,
    } = this.props;
    const {
      name,
      tabooSetId,
      xpAdjustment,
    } = this.state;
    const okDisabled = !name.length;
    return (
      <Dialog
        title={t`Deck Details`}
        visible={visible}
        viewRef={viewRef}
      >
        <View style={styles.column}>
          <DialogComponent.Description style={[typography.smallLabel, space.marginTopM]}>
            { t`NAME` }
          </DialogComponent.Description>
          <DialogComponent.Input
            textInputRef={this._captureTextInputRef}
            value={name}
            onChangeText={this._onDeckNameChange}
            returnKeyType="done"
          />
        </View>
        { xpAdjustmentEnabled && (
          <View style={styles.column}>
            <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
              { t`EXPERIENCE` }
            </DialogComponent.Description>
            <View style={styles.buttonsRow}>
              <View style={styles.buttonLabel}>
                <Text style={styles.label}>
                  { this.xpString() }
                </Text>
              </View>
              <PlusMinusButtons
                count={xpAdjustment}
                onIncrement={this._incXp}
                onDecrement={this._decXp}
                size={36}
                color="dark"
                allowNegative
              />
            </View>
          </View>
        ) }
        <TabooSetDialogOptions
          tabooSets={tabooSets}
          tabooSetId={tabooSetId}
          setTabooSetId={this._setTabooSetId}
        />
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={toggleVisible}
        />
        <DialogComponent.Button
          label={t`Okay`}
          color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
          disabled={okDisabled}
          onPress={this._onOkayPress}
        />
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Platform.OS === 'ios' ? 28 : 8,
    paddingLeft: Platform.OS === 'ios' ? 28 : 8,
    marginBottom: m,
  },
  buttonLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: Platform.select({
    ios: {
      fontSize: 13,
      color: 'black',
    },
    android: {
      fontSize: 16,
      color: '#33383D',
    },
  }),
});
