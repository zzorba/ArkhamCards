import React from 'react';
import { DynamicColorIOS, KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import AnimatedModal from 'react-native-modal';

import COLORS from '@styles/colors';

const IOS_MODAL_ANIMATION = {
  from: { opacity: 0, scale: 1.2 },
  0.5: { opacity: 1 },
  to: { opacity: 1, scale: 1 },
};

interface Props {
  blurComponentIOS?: React.ReactNode;
  buttonSeparatorStyle?: ViewStyle;
  children: React.ReactNode;

  contentStyle?: ViewStyle;
  footerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  blurStyle?: ViewStyle;
  visible?: boolean;
}

export default class DialogContainer extends React.PureComponent<Props> {
  render() {
    const {
      blurComponentIOS,
      buttonSeparatorStyle = {},
      children,
      contentStyle = {},
      footerStyle = {},
      headerStyle = {},
      blurStyle = {},
      visible = false,
      ...otherProps
    } = this.props;
    const titleChildrens: React.ReactNode[] = [];
    const descriptionChildrens: React.ReactNode[] = [];
    const buttonChildrens: React.ReactNode[] = [];
    const otherChildrens: React.ReactNode[] = [];
    React.Children.forEach(children, (child: any) => {
      if (!child) {
        return;
      }
      if (
        child.type &&
        child.type.name === 'DialogTitle' ||
        child.type.displayName === 'DialogTitle'
      ) {
        titleChildrens.push(child);
      } else if (
        child.type.name === 'DialogDescription' ||
        child.type.displayName === 'DialogDescription'
      ) {
        descriptionChildrens.push(child);
      } else if (
        child.type.name === 'DialogButton' ||
        child.type.displayName === 'DialogButton'
      ) {
        if (Platform.OS === 'ios' && buttonChildrens.length > 0) {
          buttonChildrens.push(
            <View style={[styles.buttonSeparator, buttonSeparatorStyle]} />
          );
        }
        buttonChildrens.push(child);
      } else {
        otherChildrens.push(child);
      }
    });
    return (
      <AnimatedModal
        backdropOpacity={0.3}
        style={styles.modal}
        isVisible={visible}
        animationIn={Platform.OS === 'ios' ? IOS_MODAL_ANIMATION : 'zoomIn'}
        animationOut={'fadeOut'}
        {...otherProps}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={[styles.content, contentStyle]}>
            {Platform.OS === 'ios' && blurComponentIOS}
            {Platform.OS === 'ios' && !blurComponentIOS && (
              <View style={[styles.blur, blurStyle]} />
            )}
            <View style={[styles.header, headerStyle]}>
              {titleChildrens}
              {descriptionChildrens}
            </View>
            {otherChildrens}
            {Boolean(buttonChildrens.length) && (
              <View style={[styles.footer, footerStyle]}>
                {buttonChildrens.map((x, i) =>
                  React.cloneElement(x as any, {
                    key: `dialog-button-${i}`,
                  })
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </AnimatedModal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? DynamicColorIOS({ light: 'white', dark: '#222' }) : 'white',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: Platform.select({
    ios: {
      width: 270,
      backgroundColor: COLORS.modalBackground,
      flexDirection: 'column',
      borderRadius: 13,
      overflow: 'hidden',
    },
    default: {
      flexDirection: 'column',
      backgroundColor: COLORS.modalBackground,
      borderRadius: 3,
      padding: 16,
      margin: 16,
      overflow: 'hidden',
      elevation: 4,
      minWidth: 300,
    },
  }),
  header: Platform.select({
    ios: {
      margin: 18,
    },
    default: {
      margin: 12,
    },
  }),
  footer: Platform.select({
    ios: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopColor: COLORS.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
      height: 46,
    },
    default: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 4,
    },
  }),
  buttonSeparator: {
    height: '100%',
    backgroundColor: COLORS.divider,
    width: StyleSheet.hairlineWidth,
  },
});
