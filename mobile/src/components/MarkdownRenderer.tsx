import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../contexts/ThemeContext';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { theme } = useTheme();

  const markdownStyles = {
    body: {
      fontSize: 14,
      color: theme.colors.onSurface,
      lineHeight: 22,
      textAlign: 'justify' as const,
    },
    heading1: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: theme.colors.onSurface,
      marginBottom: 10,
      marginTop: 0,
      lineHeight: 28,
    },
    heading2: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.colors.onSurface,
      marginBottom: 8,
      marginTop: 12,
      lineHeight: 26,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.colors.onSurface,
      marginBottom: 6,
      marginTop: 10,
      lineHeight: 24,
    },
    heading4: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.onSurface,
      marginBottom: 6,
      marginTop: 8,
      lineHeight: 22,
    },
    paragraph: {
      marginBottom: 10,
      lineHeight: 22,
      color: theme.colors.onSurface,
      textAlign: 'justify' as const,
    },
    strong: {
      fontWeight: '700' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
    bullet_list: {
      marginBottom: 10,
      marginTop: 0,
    },
    ordered_list: {
      marginBottom: 10,
      marginTop: 0,
    },
    list_item: {
      marginBottom: 4,
      flexDirection: 'row' as const,
      color: theme.colors.onSurface,
    },
    code_inline: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      fontFamily: 'monospace',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 13,
    },
    code_block: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    fence: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    blockquote: {
      backgroundColor: theme.colors.surfaceVariant,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 10,
      paddingVertical: 6,
      marginVertical: 10,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline' as const,
    },
    hr: {
      backgroundColor: theme.colors.outline,
      height: 1,
      marginVertical: 12,
    },
  };

  return (
    <View style={styles.container}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
