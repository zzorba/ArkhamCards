/* eslint-disable react-native/no-unused-styles */
import React, { useCallback, useContext, useMemo } from 'react';
import { Platform, Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import MarkdownIt from 'markdown-it';
import { parseDocument } from 'htmlparser2';
import { Element, Text as DomText, Node as DomNode } from 'domhandler';

import StyleContext, { StyleContextType } from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import { ArkhamSlimIcon as ArkhamIcon } from '@icons/ArkhamIcon';
import { ARKHAM_SLIM_GLYPHS } from '@generated/arkhamSlimGlyphs';
import { m, s } from '@styles/space';

interface Props {
  text: string;
  onLinkPress?: (url: string, context: StyleContextType) => void;
  sizeScale?: number;
  noBullet?: boolean;
  textAlignment?: 'left' | 'center' | 'right';
  isCard?: boolean;
  flavorText?: boolean; // If true, text is italic by default and <i> tags un-italicize
}

const WEIRD_BULLET_REGEX = /\\u2022/g;
const ICON_HTML_REGEX = /<span class="icon-([^"]+?)"><\/span>/g;
const ARRAY_XML_REGEX = /&rarr;/g;
const BAD_LINEBREAK_REGEX = /\/n/g;
const DIVIDER_REGEX = /^---*$/gm;
const INDENTED_BULLET_REGEX = /(^\s?--|^-—\s+)([^0-9].+)$/gm;
const BULLET_REGEX = /(^\s?-|^—\s+)([^0-9].+)$/gm;
const GUIDE_BULLET_REGEX = /(^\s?=|^=\s+)([^0-9].+)$/gm;
const PARAGRAPH_BULLET_REGEX = /(<p>- )|(<p>–)/gm;
const DOUBLE_BRACKET_REGEX = /\[\[([^\]]+)\]\]/g;
const HR_REGEX = /<hr>/g;
const NEWLINE_REGEX = /\n/g;

const BAD_ICON_NAMES: { [key: string]: string | undefined} = {
  Action: 'action',
  'per investigator': 'per_investigator',
  lightning: 'free',
  lighting: 'free',
  fast: 'free',
  will: 'willpower',
  willlpower: 'willpower',
  'auto-fail': 'auto_fail',
  autofail: 'auto_fail',
};

const ALL_ICONS = new Set([
  'guardian',
  'seeker',
  'mystic',
  'rogue',
  'survivor',
  'neutral',
  'willpower',
  'intellect',
  'combat',
  'agility',
  'wild',
  'elder_sign',
  'neutral',
  'skull',
  'cultist',
  'tablet',
  'elder_thing',
  'auto_fail',
  'per_investigator',
  'weakness',
  'action',
  'reaction',
  'free',
  'bullet',
  'guide_bullet',
  'curse',
  'bless',
  'frost',
  'seal_a',
  'seal_b',
  'seal_c',
  'seal_d',
  'seal_e',
  'day',
  'night',
  'codex',
  'tdc_rune_a',
  'tdc_rune_b',
  'tdc_rune_c',
  'tdc_rune_d',
  'tdc_rune_e',
  'tdc_rune_f',
  'tdc_rune_g',
  'tdc_rune_h',
  'tdc_rune_i',
  'tdc_rune_j',
  'tdc_rune_k',
  'tdc_rune_l',
  'tdc_rune_m',
  'tdc_rune_n',
  'tdc_rune_o',
  'tdc_rune_p',
  'tdc_rune_q',
  'tdc_rune_r',
  'tdc_rune_s',
  'tdc_rune_t',
  'tdc_rune_u',
  'tdc_rune_v',
  'tdc_rune_w',
  'tdc_rune_x',
  'tdc_rune_y',
  'tdc_rune_z',
]);

// Convert custom HTML tags to markdown that markdown-it can understand
function preprocessText(text: string, noBullet?: boolean, onLinkPress?: boolean): string {
  const cleanTextA = text
    .replace(WEIRD_BULLET_REGEX, '•')
    .replace(DOUBLE_BRACKET_REGEX, '<trait>$1</trait>') // Convert [[foo]] to bold+italic
    .replace(ICON_HTML_REGEX, '[$1]')
    .replace(ARRAY_XML_REGEX, '→')
    .replace(BAD_LINEBREAK_REGEX, '\n')
    .replace(DIVIDER_REGEX, '\n---\n')
    .replace(HR_REGEX, '<hr/><br/>');

  const cleanTextB = noBullet ? cleanTextA :
    cleanTextA.replace(INDENTED_BULLET_REGEX, '\t[bullet] $2'
    ).replace(BULLET_REGEX, '[bullet] $2'
    ).replace(GUIDE_BULLET_REGEX, '[guide_bullet] $2'
    ).replace(PARAGRAPH_BULLET_REGEX, onLinkPress ? '<p><span class="icon-bullet"></span> ' : '<p>[bullet] ');

  const cleanText = cleanTextB.replace(NEWLINE_REGEX, '<br/>');
  // Convert newlines inside HTML block tags (like blockquote) to <br/> tags
  // This ensures htmlparser2 can properly parse multi-line content inside these tags
  const blockTagPattern = /<(blockquote|center|right)>([\s\S]*?)<\/\1>/g;
  return cleanText.replace(blockTagPattern, (match, tagName, content) => {
    const processedContent = content.replace(/\n/g, '<br/>');
    return `<${tagName}>${processedContent}</${tagName}>`;
  });
}

export default function CardTextComponent({ text, onLinkPress, sizeScale = 1, noBullet, isCard, flavorText, textAlignment }: Props) {
  const { usePingFang } = useContext(LanguageContext);
  const context = useContext(StyleContext);

  const cleanText = useMemo(() => preprocessText(text, noBullet, !!onLinkPress), [text, noBullet, onLinkPress]);

  // Create markdown-it instance with HTML enabled
  const markdownItInstance = useMemo(() => {
    return MarkdownIt({ html: true, breaks: true });
  }, []);

  const wrappedOnLinkPress = useCallback((url: string): boolean => {
    if (onLinkPress) {
      onLinkPress(url, context);
      return false; // Return false to prevent default behavior
    }
    return true; // Return true to allow default behavior
  }, [onLinkPress, context]);

  // Helper to calculate scaled font sizes
  const scaledSize = useCallback((baseFontSize: number, baseLineHeight?: number) => ({
    fontSize: baseFontSize * context.fontScale * sizeScale,
    lineHeight: (baseLineHeight || baseFontSize * 1.25) * context.fontScale * sizeScale,
  }), [context.fontScale, sizeScale]);

  // Helper to create platform-specific text styles
  const createTextStyle = useCallback((styleType: 'regular' | 'bold' | 'italic' | 'bolditalic', extraStyle?: any) => {
    const baseStyle = {
      ...scaledSize(16, 20),
      color: context.colors.darkText,
      ...extraStyle,
    };

    if (usePingFang) {
      return { ...baseStyle, fontFamily: 'PingFangTC' };
    }

    // Platform-specific font handling for Android
    if (Platform.OS === 'android') {
      const fontFamilyMap = {
        regular: 'Alegreya-Regular',
        bold: 'Alegreya-Bold',
        italic: 'Alegreya-Italic',
        bolditalic: 'Alegreya-BoldItalic',
      };
      return { ...baseStyle, fontFamily: fontFamilyMap[styleType] };
    }

    // iOS can use style properties
    const iosStyleMap: any = {
      regular: { fontFamily: 'Alegreya', fontStyle: 'normal' },
      bold: { fontFamily: 'Alegreya', fontWeight: '700', fontStyle: 'normal' },
      italic: { fontFamily: 'Alegreya', fontStyle: 'italic' },
      bolditalic: { fontFamily: 'Alegreya', fontWeight: '700', fontStyle: 'italic' },
    };
    return { ...baseStyle, ...iosStyleMap[styleType] };
  }, [context, usePingFang, scaledSize]);

  const renderArkhamIcon = useCallback((iconName: string, size?: number) => {
    const translatedIconName = BAD_ICON_NAMES[iconName] || iconName;
    const iconSize = size || 16 * context.fontScale * sizeScale;

    // Check if this is a valid icon name
    if (!ALL_ICONS.has(translatedIconName)) {
      // Render as literal text [iconName]
      return (
        <Text style={{
          fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
          fontWeight: '700',
          fontSize: 16 * context.fontScale * sizeScale,
          lineHeight: 20 * context.fontScale * sizeScale,
          color: context.colors.darkText,
        }}>
          [{iconName}]
        </Text>
      );
    }

    const glyphCode = ARKHAM_SLIM_GLYPHS[translatedIconName];

    if (glyphCode) {
      // Render as inline text glyph
      return (
        <Text style={{
          fontFamily: 'arkhamslim',
          fontSize: iconSize,
          lineHeight: iconSize * 1.2,
          color: context.colors.darkText,
        }}>
          {String.fromCharCode(glyphCode)}
        </Text>
      );
    }

    // Fallback to icon component for icons not in arkhamslim
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
      }}>
        <ArkhamIcon
          name={translatedIconName}
          size={iconSize}
          color={context.colors.darkText}
        />
      </View>
    );
  }, [context, sizeScale, usePingFang]);

  // Helper to process text content and replace [icon] patterns (but not markdown links like [text](url))
  // Returns the content with icon patterns replaced by icon components
  const processTextWithIcons = useCallback((content: string, keyPrefix: string): React.ReactNode => {
    const iconPattern = /\[([^\]]+)\](?!\()/g;
    if (!iconPattern.test(content)) {
      return content;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const matches = content.matchAll(/\[([^\]]+)\](?!\()/g);

    for (const match of matches) {
      if (match.index! > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push(
        React.cloneElement(renderArkhamIcon(match[1]) as React.ReactElement, {
          key: `${keyPrefix}-icon-${match.index}`,
        })
      );
      lastIndex = match.index! + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return <>{parts}</>;
  }, [renderArkhamIcon]);

  // Config for tag rendering
  const tagConfig = useMemo((): { [tag: string]: {
    type: 'text',
    style: () => TextStyle;
  } | {
    type: 'br' | 'hr' | 'p'
  } | {
    type: 'view',
    style: ViewStyle;
    textStyle: TextStyle;
  } | {
    type: 'blockquote'
    styleKey: string;
  }} => ({
    // Text styling tags
    b: { type: 'text', style: () => createTextStyle('bold') },
    strong: { type: 'text', style: () => createTextStyle('bold') },
    // For flavor text, <i> tags un-italicize (make regular), otherwise they italicize
    i: { type: 'text', style: () => flavorText ? createTextStyle('regular') : createTextStyle('italic') },
    em: { type: 'text', style: () => flavorText ? createTextStyle('regular') : createTextStyle('italic') },
    u: { type: 'text', style: () => createTextStyle('bold', { textDecorationLine: 'underline' }) },
    strike: { type: 'text', style: () => createTextStyle('regular', { textDecorationLine: 'line-through' }) },
    del: { type: 'text', style: () => createTextStyle('regular', { textDecorationLine: 'line-through' }) },

    // Color tags
    red: { type: 'text', style: () => createTextStyle('regular', { color: context.colors.campaign.text.resolution }) },

    // Font variant tags
    smallcaps: { type: 'text', style: () => createTextStyle('bold', { fontFamily: 'Alegreya SC', textTransform: 'uppercase' }) },
    minicaps: { type: 'text', style: () => ({ fontFamily: Platform.OS === 'ios' ? 'Alegreya SC' : 'AlegreyaSC-Medium', fontWeight: Platform.OS === 'ios' ? '700' : '500', fontStyle: 'normal' as const, fontVariant: ['small-caps'] as any, ...scaledSize(16, 20), color: context.colors.darkText }) },

    // Special font tags
    cite: { type: 'text', style: () => ({ ...context.typography.tiny, ...context.typography.regular, fontFamily: 'Alegreya' }) },
    typewriter: { type: 'text', style: () => ({ fontFamily: Platform.OS === 'ios' ? 'TT2020 Style E' : 'TT2020StyleE-Regular', ...scaledSize(16, 20), color: context.colors.darkText }) },
    fancy: { type: 'text', style: () => ({ fontFamily: 'Caveat', ...scaledSize(18, 24), color: context.colors.darkText }) },
    fancy_u: { type: 'text', style: () => ({ fontFamily: 'Caveat', ...scaledSize(18, 24), textDecorationLine: 'underline' as const, color: context.colors.darkText }) },
    innsmouth: { type: 'text', style: () => ({ fontFamily: 'AboutDead', fontStyle: 'normal' as const, fontWeight: '600' as const, ...scaledSize(24, 28), color: context.colors.darkText }) },
    game: { type: 'text', style: () => ({ fontFamily: Platform.OS === 'ios' ? 'Teutonic RU' : 'Arkhamic', fontStyle: 'normal' as const, ...scaledSize(24, Platform.OS === 'ios' ? 28 : 32), color: context.colors.darkText }) },
    trait: { type: 'text', style: () => createTextStyle('bolditalic') },

    // Layout tags
    center: { type: 'view', style: { alignItems: 'center' }, textStyle: { ...createTextStyle(flavorText ? 'italic' : 'regular'), textAlign: 'center' } },
    right: { type: 'view', style: { alignItems: 'flex-end' }, textStyle: { ...createTextStyle(flavorText ? 'italic' : 'regular'), textAlign: 'right' } },
    blockquote: { type: 'blockquote', styleKey: 'blockquote' },

    // Special tags
    br: { type: 'br' },
    hr: { type: 'hr' },
    p: { type: 'p' },
  }), [context, createTextStyle, scaledSize, flavorText]);

  // Helper function to render a DOM node from htmlparser2
  const renderDomNode = useCallback((node: DomNode, key: string | number, styles: any, parentIsBlockquote: boolean = false, inheritedTextStyle?: any): React.ReactNode => {
    // Handle text nodes
    if (node.type === 'text') {
      const textData = (node as DomText).data;
      const processed = processTextWithIcons(textData, `dom-${key}`);

      // If parent is blockquote (direct child of View), wrap in Text component
      if (parentIsBlockquote) {
        return <Text key={key} style={styles.text}>{processed}</Text>;
      }
      // Otherwise return processed content - parent text-type tag will wrap it
      return processed;
    }

    // Handle element nodes
    if (node.type === 'tag') {
      const element = node as Element;
      const isBlockquote = element.name === 'blockquote';
      const config = tagConfig[element.name as keyof typeof tagConfig];

      // Determine style to pass down to children
      let childTextStyle = inheritedTextStyle;
      if (config && config.type === 'text') {
        childTextStyle = typeof config.style === 'function' ? config.style() : config.style;
      }

      // Only pass true for parentIsBlockquote if THIS element is a blockquote
      // This ensures only direct children of blockquote get wrapped, not nested text
      const children = element.children.map((child, idx) =>
        renderDomNode(child, `${key}-${idx}`, styles, isBlockquote, childTextStyle)
      );

      if (!config) {
        // Unknown tag, wrap children in Text to avoid loose strings
        return <Text key={key} style={styles.text}>{children}</Text>;
      }

      // Handle different tag types
      switch (config.type) {
        case 'text': {
          const style = typeof config.style === 'function' ? config.style() : config.style;
          return <Text key={key} style={style}>{children}</Text>;
        }
        case 'blockquote':
          // For blockquote, render children directly (already recursively parsed)
          // For center/right, wrap in Text
          return (
            <View key={key} style={styles[config.styleKey]}>
              {children}
            </View>
          );

        case 'view': {
          return (
            <Text key={key} style={config.style}>
              <Text key={key} style={config.textStyle}>{children}</Text>
            </Text>
          );
        }

        case 'br':
          // Inside blockquote, just add a small vertical space instead of a full newline
          if (parentIsBlockquote) {
            return <View key={key} style={{ height: 2 }} />;
          }
          return <Text key={key}>{'\n'}</Text>;

        case 'hr':
          return (
            <View key={key} style={styles.hr}>
              <View style={styles.hrBar} />
            </View>
          );

        case 'p':
          return <Text key={key} style={styles.paragraph}>{children}</Text>;

        default:
          return null;
      }
    }

    return null;
  }, [tagConfig, processTextWithIcons]);

  // Helper function to parse and render HTML content using htmlparser2
  const parseAndRenderHTML = useCallback((content: string, styles: any, index: number, isBlock: boolean = false): React.ReactNode => {
    const key = `html-${index}`;

    // Parse HTML into AST
    const dom = parseDocument(content);

    // Render all children from the root document
    // For block-level HTML, pass parentIsBlockquote=true so text nodes get wrapped
    const children = dom.children.map((child, idx) => renderDomNode(child, `${key}-${idx}`, styles, isBlock));

    return <React.Fragment key={key}>{children}</React.Fragment>;
  }, [renderDomNode]);

  // Create base text style to use for all text
  const baseTextStyle = useMemo(() => ({
    fontFamily: usePingFang ? 'PingFangTC' : Platform.OS === 'android' ? (flavorText ? 'Alegreya-Italic' : 'Alegreya-Regular') : 'Alegreya',
    fontSize: 16 * context.fontScale * sizeScale,
    lineHeight: 20 * context.fontScale * sizeScale,
    color: context.colors.darkText,
    ...(flavorText && Platform.OS !== 'android' && { fontStyle: 'italic' as const }),
  }), [usePingFang, context, sizeScale, flavorText]);

  // Custom rules for react-native-markdown-display
  const rules: RenderRules = useMemo(() => {
    return {
      // Handle textgroup - this is where inline content including HTML tags live
      textgroup: (node, children, _parent, styles) => {
        // Process node.children directly to handle HTML tags
        if (!node.children) {
          return <>{children}</>;
        }

        const processedElements: React.ReactNode[] = [];
        let hasItalicTag = false;
        let i = 0;

        while (i < node.children.length) {
          const child = node.children[i];

          // Handle text nodes - render them with proper styling
          if (child.type === 'text') {
            const content = child.content;
            const processed = processTextWithIcons(content, `textgroup-${i}`);
            processedElements.push(
              <Text key={`text-${i}`} style={baseTextStyle}>
                {processed}
              </Text>
            );
            i++;
          } else if (child.type === 'html_inline') {
            const htmlContent = child.content;

            // Check for opening tags and send to htmlparser2 for processing
            if (htmlContent === '<br/>' || htmlContent === '<br>') {
              processedElements.push('\n');
              i++;
            } else if (htmlContent.match(/^<(b|strong|i|em|u|strike|del|red|smallcaps|center|right|blockquote|fancy|fancy_u|typewriter|cite|minicaps|innsmouth|game|trait)>/)) {
              // For HTML tags (both standard and custom), collect the full HTML string and parse with htmlparser2
              // This ensures icon patterns inside these tags get processed correctly
              // Track if we have italic tags for Android width fix
              if (htmlContent.match(/^<(i|em)>/) && Platform.OS === 'android' && !flavorText) {
                hasItalicTag = true;
              }
              let fullHTML = htmlContent;
              let j = i + 1;
              while (j < node.children.length) {
                const nextChild = node.children[j];
                if (nextChild.type === 'html_inline') {
                  fullHTML += nextChild.content;
                  if (nextChild.content.match(/<\/(b|strong|i|em|u|strike|del|red|smallcaps|center|right|blockquote|fancy|fancy_u|typewriter|cite|minicaps|innsmouth|game|trait)>/)) {
                    break;
                  }
                } else if (nextChild.type === 'text') {
                  fullHTML += nextChild.content;
                }
                j++;
              }
              processedElements.push(parseAndRenderHTML(fullHTML, styles, i));
              i = j + 1;
            } else {
              // Skip closing tags (we handle them in the opening tag logic)
              i++;
            }
          } else {
            // Other node types (like link, strong, em, etc.), use the pre-rendered children
            processedElements.push(children[i]);
            i++;
          }
        }

        // Wrap in Text component to maintain inline text flow
        // Android has issues with Alegreya-Italic font width measurement causing text truncation
        // Apply width fix only when this textgroup contains italic tags
        return <Text key={node.key} style={hasItalicTag ? { width: '100%' } : undefined}>{processedElements}</Text>;
      },

      // Override text rendering to ensure proper styling
      text: (node, _children, _parent, styles) => {
        const content = node.content;
        const processed = processTextWithIcons(content, `text-${node.key}`);
        return (
          <Text key={node.key} style={styles.text}>
            {processed}
          </Text>
        );
      },

      // Handle inline content with HTML tags
      inline: (node, children, _parent, styles) => {
        // markdown-it splits HTML into separate tokens, so we need to reconstruct them
        // We'll process the node's children array directly
        if (!node.children) {
          return <Text key={node.key}>{children}</Text>;
        }

        const processedElements: React.ReactNode[] = [];
        let i = 0;

        while (i < node.children.length) {
          const child = node.children[i];

          // Handle text nodes
          if (child.type === 'text') {
            const content = child.content;
            const processed = processTextWithIcons(content, `inline-${i}`);
            processedElements.push(processed);
            i++;
          } else if (child.type === 'html_inline') {
            const htmlContent = child.content;

            // Check for opening tags and apply styling to following text
            if (htmlContent === '<b>' || htmlContent === '<strong>') {
              // Find the closing tag and collect text between
              let textContent = '';
              let j = i + 1;
              while (j < node.children.length &&
                     node.children[j].type !== 'html_inline' &&
                     node.children[j].content !== '</b>' &&
                     node.children[j].content !== '</strong>') {
                if (node.children[j].type === 'text') {
                  textContent += node.children[j].content;
                }
                j++;
              }

              processedElements.push(
                <Text key={`bold-${i}`} style={{ fontWeight: '700' }}>
                  {textContent}
                </Text>
              );
              i = j + 1; // Skip past the closing tag
            } else if (htmlContent === '<i>' || htmlContent === '<em>') {
              let textContent = '';
              let j = i + 1;
              while (j < node.children.length &&
                     node.children[j].type !== 'html_inline' &&
                     node.children[j].content !== '</i>' &&
                     node.children[j].content !== '</em>') {
                if (node.children[j].type === 'text') {
                  textContent += node.children[j].content;
                }
                j++;
              }

              processedElements.push(
                <Text key={`italic-${i}`} style={flavorText ? createTextStyle('regular') : createTextStyle('italic')}>
                  {textContent}
                </Text>
              );
              i = j + 1;
            } else if (htmlContent === '<u>') {
              let textContent = '';
              let j = i + 1;
              while (j < node.children.length &&
                     node.children[j].type !== 'html_inline' &&
                     node.children[j].content !== '</u>') {
                if (node.children[j].type === 'text') {
                  textContent += node.children[j].content;
                }
                j++;
              }

              processedElements.push(
                <Text key={`underline-${i}`} style={{ textDecorationLine: 'underline', fontWeight: '700' }}>
                  {textContent}
                </Text>
              );
              i = j + 1;
            } else if (htmlContent === '<strike>' || htmlContent === '<del>') {
              let textContent = '';
              let j = i + 1;
              while (j < node.children.length &&
                     node.children[j].type !== 'html_inline' &&
                     node.children[j].content !== '</strike>' &&
                     node.children[j].content !== '</del>') {
                if (node.children[j].type === 'text') {
                  textContent += node.children[j].content;
                }
                j++;
              }

              processedElements.push(
                <Text key={`strike-${i}`} style={{ textDecorationLine: 'line-through' }}>
                  {textContent}
                </Text>
              );
              i = j + 1;
            } else if (htmlContent === '<br/>' || htmlContent === '<br>') {
              processedElements.push('\n');
              i++;
            } else if (htmlContent.match(/^<(red|smallcaps|center|right|blockquote)/)) {
              // For custom tags, try to get the full HTML string
              let fullHTML = htmlContent;
              let j = i + 1;
              while (j < node.children.length) {
                if (node.children[j].type === 'html_inline') {
                  fullHTML += node.children[j].content;
                  if (node.children[j].content.match(/<\/(red|smallcaps|center|right|blockquote)>/)) {
                    break;
                  }
                } else if (node.children[j].type === 'text') {
                  fullHTML += node.children[j].content;
                }
                j++;
              }
              processedElements.push(parseAndRenderHTML(fullHTML, styles, i));
              i = j + 1;
            } else {
              // Skip closing tags (we handle them in the opening tag logic)
              i++;
            }
          } else {
            // Other node types (like link, strong, em, etc.), use the pre-rendered children
            processedElements.push(children[i]);
            i++;
          }
        }

        return <Text key={node.key}>{processedElements}</Text>;
      },

      // Override strong/bold rendering (for <b> and <strong> tags)
      strong: (node, children) => {
        return (
          <Text key={node.key} style={createTextStyle('bold')}>
            {children}
          </Text>
        );
      },

      // Override em/italic rendering (for <i> and <em> tags)
      em: (node, children) => {
        const style = flavorText ? createTextStyle('regular') : createTextStyle('italic');
        return (
          <Text key={node.key} style={style}>
            {children}
          </Text>
        );
      },

      // Override del/strikethrough rendering (for <del> and <strike> tags)
      del: (node, children) => {
        return (
          <Text key={node.key} style={createTextStyle('regular', { textDecorationLine: 'line-through' })}>
            {children}
          </Text>
        );
      },

      // Handle links
      link: (node, children, _parent, styles) => {
        const href = node.attributes?.href || '';
        return (
          <Text
            key={node.key}
            style={styles.link}
            onPress={onLinkPress ? () => wrappedOnLinkPress(href) : undefined}
          >
            {children}
          </Text>
        );
      },

      // Handle HTML blocks
      html_block: (node, _children, _parent, styles) => {
        // Use a hash of the content as the index to ensure uniqueness
        const contentHash = node.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return parseAndRenderHTML(node.content, styles, contentHash, true);
      },

      // Custom HTML tags via html_inline
      html_inline: () => {
        // Don't render opening/closing HTML tags - they're handled by the textgroup handler
        return null;
      },
    };
  }, [flavorText, parseAndRenderHTML, createTextStyle, onLinkPress, processTextWithIcons, wrappedOnLinkPress, baseTextStyle]);

  const markdownStyles = useMemo(() => {
    const baseFontSize = 16 * context.fontScale * sizeScale;
    const baseLineHeight = 20 * context.fontScale * sizeScale;

    return StyleSheet.create({
      body: {
        color: context.colors.darkText,
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
        textAlign: textAlignment || 'left',
      },
      paragraph: {
        fontFamily: usePingFang ? 'PingFangTC' : Platform.OS === 'android' ? (flavorText ? 'Alegreya-Italic' : 'Alegreya-Regular') : 'Alegreya',
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
        marginTop: 4,
        marginBottom: 4,
        color: context.colors.darkText,
        textAlign: textAlignment || 'left',
        ...(flavorText && Platform.OS !== 'android' && { fontStyle: 'italic' as const }),
        ...(Platform.OS === 'android' && {
          includeFontPadding: false,
          textAlignVertical: 'center' as const,
        }),
      },
      text: {
        fontFamily: usePingFang ? 'PingFangTC' : Platform.OS === 'android' ? (flavorText ? 'Alegreya-Italic' : 'Alegreya-Regular') : 'Alegreya',
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
        color: context.colors.darkText,
        textAlign: textAlignment || 'left',
        ...(flavorText && Platform.OS !== 'android' && { fontStyle: 'italic' as const }),
      },
      strong: {
        fontFamily: usePingFang ? 'PingFangTC' : Platform.OS === 'android' ? 'Alegreya-Bold' : 'Alegreya',
        fontWeight: '700',
      },
      em: {
        fontStyle: 'italic',
      },
      link: {
        color: context.colors.navButton,
        textDecorationLine: 'underline',
      },
      heading1: {
        ...context.typography.bigGameFont,
      },
      heading2: {
        ...context.typography.gameFont,
        fontSize: 22,
        lineHeight: 24,
      },
      heading3: {
        ...context.typography.gameFont,
        fontSize: 20,
        lineHeight: 22,
      },
      heading4: {
        ...context.typography.gameFont,
        fontSize: 18,
        lineHeight: 20,
      },
      heading5: {
        ...context.typography.gameFont,
        fontSize: 16,
        lineHeight: 18,
      },
      heading6: {
        ...context.typography.gameFont,
        fontSize: 14,
        lineHeight: 16,
      },
      hr: {
        backgroundColor: 'transparent',
        width: '100%',
        flexDirection: 'row',
        paddingTop: m,
        paddingBottom: s,
      },
      hrBar: {
        backgroundColor: context.colors.L10,
        height: StyleSheet.hairlineWidth,
        flex: 1,
      },
      blockquote: {
        paddingLeft: isCard ? s : m,
        paddingTop: s,
        marginBottom: s,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      table: {
        borderWidth: 1,
        borderColor: context.colors.L20,
        borderRadius: 4,
      },
      th: {
        ...context.typography.bold,
        padding: 8,
        backgroundColor: context.colors.L10,
      },
      tr: {
        borderBottomWidth: 1,
        borderColor: context.colors.L20,
        flexDirection: 'row',
      },
      td: {
        padding: 8,
      },
    });
  }, [context, usePingFang, isCard, sizeScale, flavorText, textAlignment]);

  return (
    <Markdown
      style={markdownStyles}
      rules={rules}
      markdownit={markdownItInstance}
      onLinkPress={onLinkPress ? wrappedOnLinkPress : undefined}
    >
      {cleanText}
    </Markdown>
  );
}
