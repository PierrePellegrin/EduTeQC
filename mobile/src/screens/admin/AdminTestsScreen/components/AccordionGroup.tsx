import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, UIManager, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from '../../../../components/accordionStyles';
import { useAccordionRotation } from '../../../../components/useAccordionRotation';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionGroupProps = {
  title: string;
  count: number;
  icon: string;
  expanded: boolean;
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    primary: string;
    outline: string;
  };
  onToggle: () => void;
  children: React.ReactNode;
};

const AccordionGroupComponent: React.FC<AccordionGroupProps> = ({
  title,
  count,
  icon,
  expanded,
  themeColors,
  onToggle,
  children,
}) => {
  const rotateInterpolation = useAccordionRotation(expanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[accordionStyles.header, { backgroundColor: themeColors.cardBackground }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[accordionStyles.headerContent, { gap: 12 }]}>
          <Icon name={icon} size={24} color={themeColors.primary} />
          <Text style={[accordionStyles.title, { color: themeColors.onCardBackground }]}>
            {title} ({count})
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Icon
            name="chevron-down"
            size={24}
            color={themeColors.onCardBackground}
          />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
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
    prev.title === next.title &&
    prev.count === next.count &&
    prev.icon === next.icon &&
    prev.expanded === next.expanded &&
    prev.themeColors.cardBackground === next.themeColors.cardBackground &&
    prev.themeColors.onCardBackground === next.themeColors.onCardBackground &&
    prev.themeColors.primary === next.themeColors.primary
  );
};

export const AccordionGroup = memo(AccordionGroupComponent, arePropsEqual);
