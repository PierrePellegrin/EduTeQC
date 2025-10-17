import React, { memo, useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Platform, UIManager } from 'react-native';
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
  const animatedRotation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    // Ultra-fast rotation animation - no state management delays
    Animated.timing(animatedRotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotateInterpolation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: themeColors.cardBackground }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Icon name={icon} size={24} color={themeColors.primary} style={styles.icon} />
        <Text variant="titleMedium" style={[styles.title, { color: themeColors.onCardBackground }]}>
          {groupKey} ({groupCourses.length})
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Icon
            name="chevron-down"
            size={24}
            color={themeColors.onCardBackground}
          />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
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
