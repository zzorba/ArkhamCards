import React, { useState, useCallback, useMemo, useContext } from 'react';
import { View } from 'react-native';
import { concat, flatMap, map, sortBy, trim, uniq } from 'lodash';
import { c, t } from 'ttag';

import space, { s } from '@styles/space';
import { FIXED_TAGS, localizeTag, TagChicletButton, unlocalizeTag } from './TagChiclet';
import { Toggles } from '@components/core/hooks';
import TextInputLine from '@components/core/NewDialog/TextInputLine';
import DeckButton from './controls/DeckButton';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  deckTags: Toggles;
  toggleDeckTag: (tag: string) => void;
  setDeckTag: (tag: string, set: boolean) => void;
  allTags: string[];
  editable: boolean;
}

export default function useTagPile({
  allTags,
  editable,
  toggleDeckTag,
  setDeckTag,
  deckTags,
}: Props): [React.ReactNode, (value: boolean) => void] {
  const [addVisible, setAddVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { lang } = useContext(LanguageContext);
  const onShowAdd = useCallback(() => {
    setAddVisible(true);
    setNewTag('');
  }, [setAddVisible, setNewTag]);
  const cancelAddTag = useCallback(() => {
    setAddVisible(false);
  }, [setAddVisible]);
  const onSubmitTag = useCallback(() => {
    const tag = trim(newTag.replace(/,/g, '')).replace(' ', '-');
    setDeckTag(unlocalizeTag(tag, lang), true);
    setAddVisible(false);
  }, [setDeckTag, setAddVisible, newTag, lang]);
  const sortedTags = useMemo(() => {
    return sortBy(
      uniq(
        concat(
          allTags,
          flatMap(deckTags, (value, tag) => value ? tag : []),
          FIXED_TAGS
        )
      ),
      t => localizeTag(t)
    );
  }, [allTags, deckTags]);
  return [
    <View key="node" style={{ flexDirection: 'column' }}>
      <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, space.paddingBottomS]}>
        { map(sortedTags, t => (
          <View style={space.paddingBottomXs} key={t}>
            <TagChicletButton
              tag={t}
              onSelectTag={toggleDeckTag}
              selected={!!deckTags[t]}
              disabled={!editable}
            />
          </View>
        )) }
        { !addVisible && editable && (
          <TagChicletButton
            tag={t`+ Add`}
            selected={false}
            onSelectTag={onShowAdd}
          />
        )}
      </View>
      { !!addVisible && editable && (
        <>
          <TextInputLine
            onSubmit={onSubmitTag}
            value={newTag}
            onChangeText={setNewTag}
            shrink
          />
          <View style={[{ flexDirection: 'row' }, space.paddingTopS]}>
            <DeckButton
              thin
              icon="plus-button"
              title={c('tags').t`Add`}
              onPress={onSubmitTag}
              disabled={!newTag}
              color={!newTag ? 'light_gray_outline' : 'dark_gray'}
              noShadow
            />
            <DeckButton
              thin
              icon="dismiss"
              leftMargin={s}
              title={c('tags').t`Cancel`}
              onPress={cancelAddTag}
              color="light_gray"
              noShadow
            />
          </View>
        </>
      ) }
    </View>,
    setAddVisible,
  ];
}