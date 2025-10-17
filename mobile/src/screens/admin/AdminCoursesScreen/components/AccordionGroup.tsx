import React, { memo, useState, useEffect } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { StyleSheet } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionGroupProps = {
  groupKey: string;
  groupCourses: any[];
  isExpanded: boolean;
  onToggle: () => void;
  icon: string;
  children: React.ReactNode;
};

const AccordionGroupComponent: React.FC<AccordionGroupProps> = ({
  groupKey,
  groupCourses,
  isExpanded,
  onToggle,
  icon,
  children,
}) => {
  const { theme } = useTheme();
  const [shouldRenderContent, setShouldRenderContent] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      // Render content immediately when expanding
      setShouldRenderContent(true);
    } else {
      // Delay unmounting when collapsing for smooth animation
      const timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: theme.colors.cardBackground }]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Icon name={icon} size={24} color={theme.colors.primary} style={styles.icon} />
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onCardBackground }]}>
          {groupKey} ({groupCourses.length})
        </Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={theme.colors.onCardBackground}
        />
      </TouchableOpacity>
      {shouldRenderContent && (
        <View style={[styles.content, { opacity: isExpanded ? 1 : 0 }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  content: {
    paddingTop: 4,
  },
});

export const AccordionGroup = memo(AccordionGroupComponent);
