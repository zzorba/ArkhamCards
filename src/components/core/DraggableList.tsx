import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { DragEndParams, NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

export type DraggableListRenderInfo<T> = Omit<DragListRenderItemInfo<T>, 'separators'>;
interface Props<T> {
  renderItem: (info: DraggableListRenderInfo<T>) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
  onDragEnd: (items: T[]) => void;
  data: T[];
}

export default function DraggableList<T>(props: Props<T>): JSX.Element | null {
  if (Platform.OS === 'android') {
    return <DraggableListAndroid {...props} />;
  }
  return <DraggableListIos {...props} />;
}


function DraggableListAndroid<T>({ data, renderItem, keyExtractor, onDragEnd }: Props<T>) {
  const onReordered = useCallback(async (fromIndex: number, toIndex: number) => {
    const copy = [...data];
    const removed = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed[0]);
    onDragEnd(copy);
  }, [data, onDragEnd]);
  return (
    <DragList
      data={data}
      onReordered={onReordered}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

function DraggableListIos<T>({ data, renderItem, keyExtractor, onDragEnd }: Props<T>) {
  const renderItemIos = useCallback((info: RenderItemParams<T>) => (
    <ScaleDecorator key={keyExtractor(info.item)}>
      { renderItem({
        index: info.getIndex() || 0,
        item: info.item,
        isActive: info.isActive,
        onStartDrag: info.drag,
        onEndDrag: () => {},
      }) }
    </ScaleDecorator>
  ), [renderItem]);
  const onDragEndIos = useCallback((info: DragEndParams<T>) => {
    onDragEnd(info.data);
  }, [onDragEnd]);
  return (
    <NestableDraggableFlatList
      data={data}
      onDragEnd={onDragEndIos}
      renderItem={renderItemIos}
      keyExtractor={keyExtractor}
    />
  );
}