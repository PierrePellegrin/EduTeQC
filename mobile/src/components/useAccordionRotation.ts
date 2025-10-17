import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Hook partagé pour l'animation de rotation du chevron des accordéons
 * Animation ultra-rapide de 100ms, sans délai d'état intermédiaire
 * 
 * @param expanded - État d'ouverture de l'accordéon
 * @returns Valeur interpolée pour la rotation (0deg fermé, 180deg ouvert)
 */
export const useAccordionRotation = (expanded: boolean) => {
  const animatedRotation = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    // Ultra-fast rotation animation - no state management delays
    Animated.timing(animatedRotation, {
      toValue: expanded ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [expanded, animatedRotation]);

  const rotateInterpolation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return rotateInterpolation;
};
