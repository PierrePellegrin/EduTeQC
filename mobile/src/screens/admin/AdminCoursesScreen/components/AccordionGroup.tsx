import React, { memo } from 'react';
import { View, TouchableOpacity, Animated, Platform, UIManager } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import { accordionStyles } from '../../../../components/accordionStyles';
import { useAccordionRotation } from '../../../../components/useAccordionRotation';

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
  const rotateInterpolation = useAccordionRotation(isExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[accordionStyles.header, { backgroundColor: themeColors.cardBackground }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Icon name={icon} size={24} color={themeColors.primary} style={accordionStyles.icon} />
        <Text variant="titleMedium" style={[accordionStyles.title, { color: themeColors.onCardBackground }]}>
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
  container: accordionStyles.container,
  content: accordionStyles.content,
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
