import React, { useCallback } from 'react';
import { DragEndParams, NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export type DraggableListRenderInfo<T> = RenderItemParams<T>
interface Props<T> {
  renderItem: (info: DraggableListRenderInfo<T>) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
  onChanged: (items: T[]) => void;
  data: T[];
}

export default function DraggableList<T>({ keyExtractor, renderItem, data, onChanged}: Props<T>): JSX.Element | null {
  const renderItemIos = useCallback((info: RenderItemParams<T>) => (
    <ScaleDecorator key={keyExtractor(info.item)}>
      { renderItem(info) }
    </ScaleDecorator>
  ), [renderItem]);
  const onDragEnd = useCallback((info: DragEndParams<T>) => {
    onChanged(info.data);
  }, [onChanged]);
  return (
    <NestableDraggableFlatList
      data={data}
      onDragEnd={onDragEnd}
      renderItem={renderItemIos}
      keyExtractor={keyExtractor}
    />
  );
}