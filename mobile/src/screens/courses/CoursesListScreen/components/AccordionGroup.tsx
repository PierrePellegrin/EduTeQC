import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from '../../../../components/accordionStyles';
import { useAccordionRotation } from '../../../../components/useAccordionRotation';

type AccordionGroupProps = {
  title: string;
  count: number;
  icon: string;
  expanded: boolean;
  themeColors?: {
    cardBackground: string;
    onCardBackground: string;
    primary: string;
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

  const cardBg = themeColors?.cardBackground || '#FFFFFF';
  const onCard = themeColors?.onCardBackground || '#000000';
  const primary = themeColors?.primary || '#6200ee';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[accordionStyles.header, { backgroundColor: cardBg }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={accordionStyles.headerContent}>
          <Icon name={icon} size={24} color={primary} />
          <Text style={[accordionStyles.title, { color: onCard }]}>
            {title} ({count})
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Icon name="chevron-down" size={24} color={onCard} />
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

// Custom comparison for better memoization
const arePropsEqual = (prev: AccordionGroupProps, next: AccordionGroupProps) => {
  return (
    prev.title === next.title &&
    prev.count === next.count &&
    prev.icon === next.icon &&
    prev.expanded === next.expanded
  );
};

export const AccordionGroup = memo(AccordionGroupComponent, arePropsEqual);
