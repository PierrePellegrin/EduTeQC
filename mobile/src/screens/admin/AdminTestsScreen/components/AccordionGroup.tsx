import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [shouldRenderChildren, setShouldRenderChildren] = useState(expanded);

  useEffect(() => {
    if (expanded) {
      setShouldRenderChildren(true);
    } else {
      // Delay unmount for smooth animation
      const timeout = setTimeout(() => setShouldRenderChildren(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [expanded]);

  const handleToggle = () => {
    LayoutAnimation.configureNext({
      duration: 200,
      update: { type: 'easeInEaseOut', property: 'opacity' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
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
        <View style={styles.headerContent}>
          <Icon name={icon} size={24} color={themeColors.primary} />
          <Text style={[styles.title, { color: themeColors.onCardBackground }]}>
            {title} ({count})
          </Text>
        </View>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={themeColors.onCardBackground}
        />
      </TouchableOpacity>

      {shouldRenderChildren && expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    marginTop: 4,
  },
});

export const AccordionGroup = memo(AccordionGroupComponent);
