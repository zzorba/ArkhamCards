import React, { ReactNode } from 'react';
import { View } from 'react-native';

import DialogComponent from '@lib/react-native-dialog';

interface Props {
  title: string;
  visible: boolean;
  children?: ReactNode;
}

export default function Dialog({ title, visible, children }: Props) {
  return (
    <View>
      <DialogComponent.Container
        visible={visible}
      >
        <DialogComponent.Title>
          { title }
        </DialogComponent.Title>
        { children }
      </DialogComponent.Container>
    </View>
  );
}
