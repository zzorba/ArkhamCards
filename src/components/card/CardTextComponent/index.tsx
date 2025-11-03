import React, { useCallback, useContext, useMemo } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Markdown, { RenderRules, MarkdownIt as MarkdownItType } from 'react-native-markdown-display';
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
  style?: any;
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

// Convert custom HTML tags to markdown that markdown-it can understand
function preprocessText(text: string, noBullet?: boolean, onLinkPress?: boolean): string {
  const cleanTextA = text
    .replace(WEIRD_BULLET_REGEX, '•')
    .replace(DOUBLE_BRACKET_REGEX, '<b><i>$1</i></b>')  // Convert [[foo]] to bold+italic
    .replace(ICON_HTML_REGEX, '[$1]')
    .replace(ARRAY_XML_REGEX, '→')
    .replace(BAD_LINEBREAK_REGEX, '\n')
    .replace(DIVIDER_REGEX, '\n---\n');

  const cleanText = noBullet ? cleanTextA :
    cleanTextA.replace(INDENTED_BULLET_REGEX,
      onLinkPress ? '\t<span class="icon-bullet"></span> $2' : '\t[bullet] $2'
    ).replace(BULLET_REGEX,
      onLinkPress ? '<span class="icon-bullet"></span> $2' : '[bullet] $2'
    ).replace(GUIDE_BULLET_REGEX,
      onLinkPress ? '<span class="icon-guide_bullet"></span> $2' : '[guide_bullet] $2'
    ).replace(PARAGRAPH_BULLET_REGEX, onLinkPress ? '<p><span class="icon-bullet"></span> ' : '<p>[bullet] ');

  // Convert newlines inside HTML block tags (like blockquote) to <br/> tags
  // This ensures htmlparser2 can properly parse multi-line content inside these tags
  const blockTagPattern = /<(blockquote|center|right)>([\s\S]*?)<\/\1>/g;
  return cleanText.replace(blockTagPattern, (match, tagName, content) => {
    const processedContent = content.replace(/\n/g, '<br/>');
    return `<${tagName}>${processedContent}</${tagName}>`;
  });
}

export default function CardTextComponent({ text, style, onLinkPress, sizeScale = 1, noBullet, flavorText }: Props) {
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
      regular: { fontFamily: 'Alegreya' },
      bold: { fontFamily: 'Alegreya', fontWeight: '700' },
      italic: { fontFamily: 'Alegreya', fontStyle: 'italic' },
      bolditalic: { fontFamily: 'Alegreya', fontWeight: '700', fontStyle: 'italic' },
    };
    return { ...baseStyle, ...iosStyleMap[styleType] };
  }, [context, sizeScale, usePingFang, scaledSize]);

  const renderArkhamIcon = useCallback((iconName: string, size?: number) => {
    const iconSize = size || 16 * context.fontScale * sizeScale;
    const glyphCode = ARKHAM_SLIM_GLYPHS[iconName];

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
          name={iconName}
          size={iconSize}
          color={context.colors.darkText}
        />
      </View>
    );
  }, [context, sizeScale]);

  // Config for tag rendering
  const tagConfig = useMemo(() => ({
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
    game: { type: 'text', style: () => ({ fontFamily: Platform.OS === 'ios' ? 'Teutonic RU' : 'TT2020StyleE-Regular', fontStyle: 'normal' as const, ...scaledSize(24, Platform.OS === 'ios' ? 28 : 32), color: context.colors.darkText }) },

    // Layout tags
    center: { type: 'view', style: { alignItems: 'center' }, textStyle: { textAlign: 'center' } },
    right: { type: 'view', style: { alignItems: 'flex-end' }, textStyle: { textAlign: 'right' } },
    blockquote: { type: 'view', styleKey: 'blockquote' },

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

      // Check if text contains icon patterns
      const iconPattern = /\[([^\]]+)\]/g;
      if (iconPattern.test(textData)) {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let partIndex = 0;
        const matches = textData.matchAll(/\[([^\]]+)\]/g);

        for (const match of matches) {
          if (match.index! > lastIndex) {
            const textPart = textData.slice(lastIndex, match.index);
            // Strings in arrays MUST have keys - wrap in Fragment with key
            if (textPart) {
              parts.push(
                <React.Fragment key={`text-${key}-${partIndex++}`}>{textPart}</React.Fragment>
              );
            }
          }
          const icon = renderArkhamIcon(match[1]);
          parts.push(
            React.cloneElement(icon as React.ReactElement, { key: `icon-${key}-${partIndex++}` })
          );
          lastIndex = match.index! + match[0].length;
        }
        if (lastIndex < textData.length) {
          const textPart = textData.slice(lastIndex);
          // Strings in arrays MUST have keys - wrap in Fragment with key
          if (textPart) {
            parts.push(
              <React.Fragment key={`text-${key}-${partIndex++}`}>{textPart}</React.Fragment>
            );
          }
        }

        // Wrap in Text if parent is blockquote (View), otherwise return raw for parent Text tag
        if (parentIsBlockquote) {
          return <Text key={key} style={styles.text}>{parts}</Text>;
        }
        return parts;
      }

      // If parent is blockquote (direct child of View), wrap text in Text component
      if (parentIsBlockquote) {
        return <Text key={key} style={styles.text}>{textData}</Text>;
      }
      // Otherwise return raw string - parent text-type tag will wrap it
      return textData;
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

        case 'view': {
          const viewStyle = config.styleKey ? styles[config.styleKey] : config.style;
          // For blockquote, render children directly (already recursively parsed)
          // For center/right, wrap in Text
          if (element.name === 'blockquote') {
            return (
              <View key={key} style={viewStyle}>
                {children}
              </View>
            );
          }
          return (
            <View key={key} style={viewStyle}>
              <Text style={config.textStyle}>{children}</Text>
            </View>
          );
        }

        case 'br':
          // Inside blockquote, just add a small vertical space instead of a full newline
          if (parentIsBlockquote) {
            return <View key={key} style={{ height: 2 }} />;
          }
          return <Text key={key}>{'\n'}</Text>;

        case 'hr':
          return <View key={key} style={styles.hr} />;

        case 'p':
          return <Text key={key} style={styles.paragraph}>{children}</Text>;

        default:
          return null;
      }
    }

    return null;
  }, [tagConfig]);

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
      textgroup: (node, children, parent, styles) => {
        // Process node.children directly to handle HTML tags
        if (!node.children) {
          return <>{children}</>;
        }

        const processedElements: React.ReactNode[] = [];
        let i = 0;

        while (i < node.children.length) {
          const child = node.children[i];

          // Handle text nodes - render them with proper styling
          if (child.type === 'text') {
            const content = child.content;
            const iconPattern = /\[([^\]]+)\]/g;

            // Check if this text contains icon patterns
            if (iconPattern.test(content)) {
              const parts: React.ReactNode[] = [];
              let lastIndex = 0;
              const matches = content.matchAll(/\[([^\]]+)\]/g);

              for (const match of matches) {
                if (match.index! > lastIndex) {
                  parts.push(
                    <Text key={`text-${i}-${lastIndex}`} style={styles.text}>
                      {content.slice(lastIndex, match.index)}
                    </Text>
                  );
                }
                parts.push(
                  <React.Fragment key={`icon-${i}-${match.index}`}>
                    {renderArkhamIcon(match[1])}
                  </React.Fragment>
                );
                lastIndex = match.index! + match[0].length;
              }
              if (lastIndex < content.length) {
                parts.push(
                  <Text key={`text-${i}-${lastIndex}`} style={styles.text}>
                    {content.slice(lastIndex)}
                  </Text>
                );
              }
              processedElements.push(...parts);
            } else {
              processedElements.push(
                <Text key={`text-${i}`} style={baseTextStyle}>
                  {content}
                </Text>
              );
            }
            i++;
          } else if (child.type === 'html_inline') {
            const htmlContent = child.content;

            // Check for opening tags and send to htmlparser2 for processing
            if (htmlContent === '<br/>' || htmlContent === '<br>') {
              processedElements.push('\n');
              i++;
            } else if (htmlContent.match(/^<(b|strong|i|em|u|strike|del|red|smallcaps|center|right|blockquote|fancy|fancy_u|typewriter|cite|minicaps|innsmouth|game)>/)) {
              // For HTML tags (both standard and custom), collect the full HTML string and parse with htmlparser2
              // This ensures icon patterns inside these tags get processed correctly
              let fullHTML = htmlContent;
              let j = i + 1;
              while (j < node.children.length) {
                const nextChild = node.children[j];
                if (nextChild.type === 'html_inline') {
                  fullHTML += nextChild.content;
                  if (nextChild.content.match(/<\/(b|strong|i|em|u|strike|del|red|smallcaps|center|right|blockquote|fancy|fancy_u|typewriter|cite|minicaps|innsmouth|game)>/)) {
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
            // Other node types, render normally
            i++;
          }
        }

        // Wrap in Text component to maintain inline text flow
        return <Text key={node.key}>{processedElements}</Text>;
      },

      // Override text rendering to ensure proper styling
      text: (node, children, parent, styles) => {
        const content = node.content;

        // Check if this text contains icon patterns
        const iconPattern = /\[([^\]]+)\]/g;
        if (iconPattern.test(content)) {
          const parts: React.ReactNode[] = [];
          let lastIndex = 0;
          const matches = content.matchAll(/\[([^\]]+)\]/g);

          for (const match of matches) {
            if (match.index! > lastIndex) {
              parts.push(
                <Text key={`text-${lastIndex}`} style={styles.text}>
                  {content.slice(lastIndex, match.index)}
                </Text>
              );
            }
            parts.push(
              <React.Fragment key={`icon-${match.index}`}>
                {renderArkhamIcon(match[1])}
              </React.Fragment>
            );
            lastIndex = match.index! + match[0].length;
          }
          if (lastIndex < content.length) {
            parts.push(
              <Text key={`text-${lastIndex}`} style={styles.text}>
                {content.slice(lastIndex)}
              </Text>
            );
          }
          return <Text key={node.key} style={styles.text}>{parts}</Text>;
        }

        return (
          <Text key={node.key} style={styles.text}>
            {content}
          </Text>
        );
      },

      // Handle inline content with HTML tags
      inline: (node, children, parent, styles) => {
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
            const iconPattern = /\[([^\]]+)\]/g;

            // Check if this text contains icon patterns
            if (iconPattern.test(content)) {
              const parts: React.ReactNode[] = [];
              let lastIndex = 0;
              const matches = content.matchAll(/\[([^\]]+)\]/g);

              for (const match of matches) {
                if (match.index! > lastIndex) {
                  parts.push(content.slice(lastIndex, match.index));
                }
                parts.push(
                  <React.Fragment key={`icon-${i}-${match.index}`}>
                    {renderArkhamIcon(match[1])}
                  </React.Fragment>
                );
                lastIndex = match.index! + match[0].length;
              }
              if (lastIndex < content.length) {
                parts.push(content.slice(lastIndex));
              }
              processedElements.push(...parts);
            } else {
              processedElements.push(content);
            }
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
            // Other node types, render normally
            i++;
          }
        }

        return <Text key={node.key}>{processedElements}</Text>;
      },

      // Override strong/bold rendering (for <b> and <strong> tags)
      strong: (node, children, parent, styles) => {
        return (
          <Text key={node.key} style={{ fontWeight: '700' }}>
            {children}
          </Text>
        );
      },

      // Override em/italic rendering (for <i> and <em> tags)
      em: (node, children, parent, styles) => {
        return (
          <Text key={node.key} style={{ fontStyle: 'italic' }}>
            {children}
          </Text>
        );
      },

      // Override del/strikethrough rendering (for <del> and <strike> tags)
      del: (node, children, parent, styles) => {
        return (
          <Text key={node.key} style={{ textDecorationLine: 'line-through' }}>
            {children}
          </Text>
        );
      },

      // Handle HTML blocks
      html_block: (node, children, parent, styles) => {
        // Use a hash of the content as the index to ensure uniqueness
        const contentHash = node.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return parseAndRenderHTML(node.content, styles, contentHash, true);
      },

      // Custom HTML tags via html_inline
      html_inline: (node, children, parent, styles) => {
        // Don't render opening/closing HTML tags - they're handled by the textgroup handler
        return null;
      },
    };
  }, [context, renderArkhamIcon, parseAndRenderHTML, baseTextStyle, usePingFang, sizeScale]);

  const markdownStyles = useMemo(() => {
    const baseFontSize = 16 * context.fontScale * sizeScale;
    const baseLineHeight = 20 * context.fontScale * sizeScale;

    return StyleSheet.create({
      body: {
        color: context.colors.darkText,
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
      },
      paragraph: {
        fontFamily: usePingFang ? 'PingFangTC' : Platform.OS === 'android' ? (flavorText ? 'Alegreya-Italic' : 'Alegreya-Regular') : 'Alegreya',
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
        marginTop: 4,
        marginBottom: 4,
        color: context.colors.darkText,
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
        backgroundColor: context.colors.L10,
        height: StyleSheet.hairlineWidth,
      },
      blockquote: {
        paddingLeft: m,
        marginTop: s,
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
  }, [context, usePingFang, sizeScale, flavorText]);

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
