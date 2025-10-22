import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { accordionStyles } from '../../../../components/accordionStyles';
import { useAccordionRotation } from '../../../../components/useAccordionRotation';

type AccordionGroupProps = {
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  themeColors?: {
    cardBackground: string;
    onCardBackground: string;
    primary: string;
  };
  count?: number;
};

export const AccordionGroup: React.FC<AccordionGroupProps> = ({ title, icon, expanded, onToggle, children, themeColors, count }) => {
  const rotateInterpolate = useAccordionRotation(expanded);

  const cardBg = themeColors?.cardBackground || '#FFFFFF';
  const onCard = themeColors?.onCardBackground || '#000000';
  const primary = themeColors?.primary || '#6200EE';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[accordionStyles.header, { backgroundColor: cardBg }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={accordionStyles.leftContent}>
          <MaterialCommunityIcons name={icon} size={24} color={primary} style={accordionStyles.icon} />
          <Text style={[accordionStyles.title, { color: onCard }]}>
            {typeof count === 'number' ? `${title} (${count})` : title}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <MaterialCommunityIcons name="chevron-down" size={24} color={onCard} />
        </Animated.View>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: accordionStyles.container,
  content: accordionStyles.content,
});
