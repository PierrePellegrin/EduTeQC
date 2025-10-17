import React, { useState, useEffect, memo, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, UIManager, StyleSheet } from 'react-native';
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
  const animatedOpacity = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    if (expanded) {
      // Render children immediately
      setShouldRenderChildren(true);
      
      // Smooth fade-in animation
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        // Unmount after animation completes
        setShouldRenderChildren(false);
      });
    }
  }, [expanded]);

  const handleToggle = () => {
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

      {shouldRenderChildren && (
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: animatedOpacity,
            }
          ]}
        >
          {children}
        </Animated.View>
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
