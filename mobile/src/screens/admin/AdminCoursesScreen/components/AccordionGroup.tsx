import React, { memo, useState, useEffect } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  themeColors: any;
};

const AccordionGroupComponent: React.FC<AccordionGroupProps> = ({
  groupKey,
  groupCourses,
  isExpanded,
  onToggle,
  icon,
  children,
  themeColors,
}) => {
  const [shouldRenderContent, setShouldRenderContent] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      // Render content immediately when expanding
      setShouldRenderContent(true);
    } else {
      // Delay unmounting when collapsing for smooth animation - reduced from 300ms to 250ms
      const timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleToggle = () => {
    // Optimized animation config - shorter duration for snappier feel
    LayoutAnimation.configureNext({
      duration: 150,
      create: { type: 'linear', property: 'opacity' },
      update: { type: 'easeInEaseOut', property: 'scaleY' },
      delete: { type: 'linear', property: 'opacity' },
    });
    onToggle();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: themeColors.cardBackground }]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Icon name={icon} size={24} color={themeColors.primary} style={styles.icon} />
        <Text variant="titleMedium" style={[styles.title, { color: themeColors.onCardBackground }]}>
          {groupKey} ({groupCourses.length})
        </Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={themeColors.onCardBackground}
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

// Custom comparison function for better memoization
const arePropsEqual = (prev: AccordionGroupProps, next: AccordionGroupProps) => {
  return (
    prev.groupKey === next.groupKey &&
    prev.groupCourses.length === next.groupCourses.length &&
    prev.isExpanded === next.isExpanded &&
    prev.icon === next.icon &&
    prev.themeColors.cardBackground === next.themeColors.cardBackground &&
    prev.themeColors.onCardBackground === next.themeColors.onCardBackground &&
    prev.themeColors.primary === next.themeColors.primary
  );
};

export const AccordionGroup = memo(AccordionGroupComponent, arePropsEqual);
