import React, { useCallback, useContext, useMemo } from 'react';
import { Text, ScrollView, StyleSheet, View, Linking } from 'react-native';
import { c } from 'ttag';

import StyleContext from '@styles/StyleContext';
import { FactionCodeType } from '@app_constants';
import { map } from 'lodash';
import { AnimatedRoundedFactionBlock } from '@components/core/RoundedFactionBlock';
import CardTextComponent from '@components/card/CardTextComponent';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import LanguageContext from '@lib/i18n/LanguageContext';
import { localizedDate } from '@lib/datetime';
import { useFlag } from '@components/core/hooks';
import ChaosToken from '@components/campaign/ChaosToken';
import FastImage from 'react-native-fast-image';

interface ReleaseNote {
  date: Date;
  title: string;
  faction: FactionCodeType;
  lines: (string | React.ReactNode)[];
}

function linkPressed(url: string) {
  Linking.openURL(url);
}

function getReleaseNotes(width: number): ReleaseNote[] {
  return [
    {
      date: new Date('2022-08-11'),
      title: c('releaseNotes').t`Cyclopean Foundations`,
      faction: 'rogue',
      lines: [
        c('releaseNotes').t`This release adds the newly finished fan-made Cyclopean Foundations campaign by The Beard.`,
        c('releaseNotes').t`- Includes a fully guided mode, with all setup and resolution text accounted for.`,
        c('releaseNotes').t`This update also adds support for several fan-made standalone scenario, including "The Colour Out of Space".`,
      ],
    },
    {
      date: new Date('2022-07-20'),
      title: c('releaseNotes').t`Settings synchronization`,
      faction: 'guardian',
      lines: [
        c('releaseNotes').t`Good news for players who use Arkham Cards with more than one device, if you sign into your Arkham Cards account your settings will now sync between devices automatically!`,
        c('releaseNotes').t`- This includes your collection + spoiler settings, as well as many general app preferences.`,
        c('releaseNotes').t`I've had some reports of slower performance on some devices, and have a new <i>"Low Memory Mode"</i> setting to try out.`,
        c('releaseNotes').t`- If you've been experiencing slow app behavior in anyway, please try it out.`,
        c('releaseNotes').t`- And if you try it out, send me an email at arkhamcards@gmail.com, I would love to hear how it is working in the wild.`,
        c('releaseNotes').t`BTW, support for the newly announced mechanic from The Scarlet Keys is in the works, so stay tuned.`,
      ],
    },
    {
      date: new Date('2022-04-10'),
      title: c('releaseNotes').t`Drafting player decks`,
      faction: 'seeker',
      lines: [
        c('releaseNotes').t`As a follow up to the earlier Ultimatum of Chaos release, the app now supports building a deck via a set of drafting rules. Choose what packs you want to pull from and how big each draft 'hand' should be, and build your deck one card at a time.`,
        c('releaseNotes').t`- You can find this feature on the deck edit screen in the menu.`,
        c('releaseNotes').t`- Only level cards / decks can be drafted.`,
        c('releaseNotes').t`- Given their unique deck-building restrictions, the app does not yet support generating random decks for Lola Hayes or Joe Diamond. This is something that I will try to address in a future release.`,
      ],
    },
    {
      date: new Date('2022-04-03'),
      title: c('releaseNotes').t`Ultimatum of Chaos`,
      faction: 'neutral',
      lines: [
        c('releaseNotes').t`The app now supports building random decks following the steps set out by the optional 'Ultimatum of Chaos' rule. When constructing a new deck, a new option lets you choose a 'special deck', which can be used to either create the FFG suggested starter deck or a fully randomly generated one.`,

        c('releaseNotes').t`- The app will use your defined collection to try to generate the deck.`,
        c('releaseNotes').t`- Support the deckbuilding focused permanents included in the Edge of the Earth Investigator expansion (Underworld Support/Forced Learning).`,
        c('releaseNotes').t`- Shows the deck before you actully save it, so you can re-roll if it produced something particularly unviable.`,
        c('releaseNotes').t`- Given their unique deck-building restrictions, the app does not yet support generating random decks for Lola Hayes or Joe Diamond. This is something that I will try to address in a future release.`,
      ],
    },
    {
      date: new Date('2022-04-01'),
      title: c('releaseNotes').t`Fan-made cards + Barkham Horror`,
      faction: 'survivor',
      lines: [
        c('releaseNotes').t`Starting with this release, there is a new setting to unlock some 'unofficial' content when searching for cards and building decks. While fan-made campaigns have been available for some time, the cards associated with them have not been searchable. To start, this includes the cards released as part of the <i>Barkham Horror</i> promotional set, as well as the excellent <i>Alice in Wonderland</i> campaign by The Beard.`,
        <View key="image" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FastImage
            style={{ width, height: width * 589 / 676 }}
            source={{ uri: 'https://img.arkhamcards.com/onboarding/custom-content.png' }}
          />
        </View>,
        c('releaseNotes').t`- To enable this feature, simply check the box for <b>Show Fan-made cards</b> under <i>Settings</i>. If you aren't interested in fan-made content, you don't have to change anything, by default you won't see these cards in the app.`,
        c('releaseNotes').t`- Decks containing 'fan-made' cards (including <i>Barkham Horror</i>), cannot be uploaded or saved to ArkhamDB. When editing an ArkhamDB deck, these custom cards will be hidden.`,
        c('releaseNotes').t`- Fan-made cards are shown with a small watermark icon indicating what set they came from, so you can tell they are unofficial.`,
        c('releaseNotes').t`Note: You might need to refresh the cards once (using <b>Check for card updates</b>).`,
        c('releaseNotes').t`Have some fan-made content you'd like to see in the app, let me know at [arkhamcards@gmail.com](mailto:arkhamcards@gmail.com).`,
      ],
    },
    {
      date: new Date('2022-03-15'),
      title: c('releaseNotes').t`Campaign sharing released!`,
      faction: 'mystic',
      lines: [
        c('releaseNotes').t`At long last, the ability to share campaigns has been released on both iOS and Android! This has been one of the most requested features from the start, but as it required a completely new set of servers to be written (and paid for), it took me some time to get it right. You can of course continue using the app exactly as it is, but if you find yourself using multiple devices or want to share an in-progress campaign with friends so everyone can collaborate on it, this is the feature for you.`,
        c('releaseNotes').t`- First sign up for an <b>Arkham Cards</b> account via the <i>Settings</i> tab, to unlock these features. Don't forget to set your handle so your friends can find you on the app.`,
        c('releaseNotes').t`- On the main screen of every campaign (or when creating a new one), there is a new option to 'Upload' the campaign to the cloud. This will cause the campaign to be synced between all of your devices.`,
        c('releaseNotes').t`- After uploading the campaign, you'll find a new option on the campaign to <b>Edit players</b>. Simply select your friends and the campaign will pop up in their app as well.`,
        c('releaseNotes').t`- Then just use the campaign as normal -- decisions and changes that you make will be synced automatically with everyone, including the chaos bag.`,
        c('releaseNotes').t`- If someone else saves your deck for you at the end of a scenario, you'll need to open the campaign to <b>Claim the previous scneario's XP</b> for yourself.`,
        c('releaseNotes').t`If you like to make changes to your decks on ArkhamDB as well as in the app, just pop open the app and make sure you see your latest deck updates there. After opening the app it should remain in sync, but if you use the app infrequently the ArkhamDB login might expire and need to be authorized.`,
      ],
    },
    {
      date: new Date('2021-12-31'),
      title: c('releaseNotes').t`Find overlap between decks`,
      faction: 'rogue',
      lines: [
        c('releaseNotes').t`If you build decks for multiple players from a single card collection, this release is for you. By adding the decks to a shared campaign, the app will calculate which cards are included in too many decks (based on your collection).`,
        <View key="image" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FastImage
            style={{ width, height: width * 462 / 400 }}
            source={{ uri: 'https://img.arkhamcards.com/onboarding/overlap.jpeg' }}
          />
        </View>,
        c('releaseNotes').t`If the deck has been added to a campaign, you'll also see this on the bottom of each deck in that campaign.`,
      ],
    },
    {
      date: new Date('2021-11-20'),
      title: c('releaseNotes').t`Edge of the Earth campaign is now out`,
      faction: 'guardian',
      lines: [
        c('releaseNotes').t`The full setup instructions for Edge of the Earth campaigns are now available in the app! This was the largest single drop of campaign content in the history of the game and a large group of volunteers helped prepare the story text so I could focus on the new mechanics to get this out as close to release date as possible.`,
        c('releaseNotes').t`Frost tokens ([frost]) are also now available in the digital chaos bags for all Edge of the Earth campaigns.`,
        <View key="icon" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ChaosToken iconKey="frost" size="small" />
        </View>,
        c('releaseNotes').t`Stay warm out there!`,
      ],
    },
    {
      date: new Date('2021-08-15'),
      title: c('releaseNotes').t`Newly designed chaos odds calculator`,
      faction: 'seeker',
      lines: [
        c('releaseNotes').t`<center>\"Never tell me the odds!\" - Han Solo</center>`,
        c('releaseNotes').t`Sorry Han, this isn't the feature for you. When it came time to try to work [bless] and [curse] tokens into the existing odds calculator, this app's visual designer (Eugene Sarnetsky) worked hard to reimagine how to present the mathy information in a more intuitive and visual manner.`,
        c('releaseNotes').t`As you can see below, the results are incredible:`,
        <View key="image" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FastImage
            style={{ width, height: width * 822 / 676 }}
            source={{ uri: 'https://img.arkhamcards.com/onboarding/odds-calculator.png' }}
          />
        </View>,
        c('releaseNotes').t`In addition to giving you the numeric pass/fail rate as before, the new visual stacking of tokens based on their current modifiers lets you quickly intuit how much you stand to gain with an extra +1 to your skill value, without having to mess with the difficulty controls at all.`,
        <View key="icon" style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ChaosToken iconKey="bless" size="tiny" />
          <View style={space.paddingLeftS}>
            <ChaosToken iconKey="curse" size="tiny" />
          </View>
        </View>,
        c('releaseNotes').t`You'll also see small bands of color to represent [bless] and [curse] worked into the display. These are spaced to show how much your odds of passing changes if you draw a single [bless] or [curse] token: in the above picture a single [curse] token draw will cause 47% of the tokens in the bag to now result in a failure -- not great!`,
        c('releaseNotes').t`Down below you can also see the odds of drawing a [bless]/[curse] token based on the current bag contents. Here the adjustment to your success odds is shown as a range, the first number being drawing one token, the second if you were to draw multiple.`,
      ],
    },

    {
      date: new Date('2021-06-15'),
      title: c('releaseNotes').t`Support for fan-made campaigns`,
      faction: 'neutral',
      lines: [
        c('releaseNotes').t`Did you know that this game has a thriving community of homebrew content creators? Well it does, and starting today, you'll start to find some of these campaigns and side-scenarios in the app.`,
        c('releaseNotes').t`Adding more campaigns will be an ongoing effort, but as of now we the following campaigns are available:`,
        c('releaseNotes').t`- Alice in Wonderland by The Beard`,
        c('releaseNotes').t`- Dark Matter by Axolotl`,
        c('releaseNotes').t`- Crown of Egil by The Mad Juggler`,
        c('releaseNotes').t`- Call of the Plaguebearer by Walker Graves`,
        c('releaseNotes').t`As for standalone scenarios:`,
        c('releaseNotes').t`- Consternation on the Constellation - by The Mythos Busters`,
        c('releaseNotes').t`If you are a content creator who is interested in getting your (completed) campaign into the app, you can reach me at [arkhamcards@gmail.com](mailto:arkhamcards@gmail.com).`,
      ],
    },
  ];
}

function ReleaseNote({ note }: { componentId: string; note: ReleaseNote }) {
  const { colors, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const { faction, title, lines, date } = note;
  const [open, toggleOpen] = useFlag(false);
  const footer = useMemo(() => (
    <View style={[
      space.paddingS,
      styles.dateFooter,
      { backgroundColor: colors.L10 },
    ]}>
      <AppIcon size={24} name="date" color={colors.D10} />
      <Text style={[space.paddingLeftS, typography.text, typography.light]}>
        { localizedDate(date, lang, true) }
      </Text>
    </View>
  ), [date, lang, colors, typography]);
  const renderHeader = useCallback((icon: React.ReactFragment) => {
    return (
      <View style={[{
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: colors.faction[faction].background,
        backgroundColor: colors.faction[faction].background,
      }, !open ? {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      } : undefined]}>
        <View style={[
          styles.block,
        ]}>
          <View style={styles.row}>
            <View style={styles.textColumn}>
              <Text style={[typography.mediumGameFont, { color: '#FFF' }, typography.center]}>
                { title }
              </Text>
            </View>
            { icon }
          </View>
        </View>
        { !open && footer }
      </View>
    );
  }, [colors, typography, open, title, faction, footer]);
  return (
    <AnimatedRoundedFactionBlock
      faction={faction}
      open={open}
      toggleOpen={toggleOpen}
      renderHeader={renderHeader}
      textColor="#FFF"
      footer={footer}
    >
      <View style={[space.paddingS, styles.noteBody]}>
        { map(lines, (t, tidx) => (
          <View key={tidx}>
            { typeof t === 'string' ? <CardTextComponent onLinkPress={linkPressed} text={t} /> : t }
          </View>
        ))}
      </View>
    </AnimatedRoundedFactionBlock>
  );
}
export default function ReleaseNotesView({ componentId }: { componentId: string }) {
  const { backgroundStyle, width } = useContext(StyleContext);
  const releaseNotes = useMemo(() => getReleaseNotes(width - s * 4), [width]);
  return (
    <View style={[{ flex: 1 }, backgroundStyle]}>
      <ScrollView style={[backgroundStyle, space.paddingSideS, space.paddingTopS]}>
        { map(releaseNotes, (note, idx) => {
          return (
            <View style={space.paddingBottomS} key={idx}>
              <ReleaseNote note={note} componentId={componentId} />
            </View>
          )
        }) }
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  noteBody: {
    flexDirection: 'column',
  },
  dateFooter: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  block: {
    padding: s,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})