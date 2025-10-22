import React from 'react';
import { View } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useSettings } from '../../../../contexts/SettingsContext';
import { styles } from '../styles';

type PackageCardProps = {
  package: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    courses?: any[];
  };
  isPurchased?: boolean;
  showBuyButton?: boolean;
  onBuy?: () => void;
  onCoursesPress?: () => void;
};

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  isPurchased,
  showBuyButton,
  onBuy,
  onCoursesPress,
}) => {
  const { theme } = useTheme();
  const { showImages } = useSettings();

  // Image par défaut si pas d'imageUrl
  const defaultImage = 'https://via.placeholder.com/800x400/2E7D32/FFFFFF?text=' + encodeURIComponent(pkg.name || 'Package');
  const imageSource = pkg.imageUrl || defaultImage;

  return (
    <Card style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}>
      {showImages && (
        <Card.Cover source={{ uri: imageSource }} style={styles.cover} />
      )}
      <Card.Content>
        <Text variant="titleMedium" style={styles.packageTitle}>
          {typeof pkg.name === 'string' && pkg.name.trim() !== '' ? pkg.name : 'N/A'}
        </Text>
        <Text style={styles.packageDesc}>
          {typeof pkg.description === 'string' && pkg.description.trim() !== '' ? pkg.description : 'N/A'}
        </Text>
        <View style={styles.chipContainerWithButton}>
          <View style={styles.chipContainer}>
            <Chip icon="currency-eur" compact style={styles.chip}>
              <Text>{typeof pkg.price === 'number' && !isNaN(pkg.price) ? `${pkg.price.toFixed(2)} €` : 'N/A'}</Text>
            </Chip>
            <Chip 
              icon="book-multiple" 
              compact 
              style={styles.chip}
              onPress={onCoursesPress}
            >
              <Text>{Array.isArray(pkg.courses) ? `${pkg.courses.length} cours` : '0 cours'}</Text>
            </Chip>
          </View>
          {showBuyButton && (
            <IconButton
              icon="cart"
              mode="contained"
              onPress={onBuy}
              disabled={isPurchased}
              style={styles.buyIconButton}
              iconColor={isPurchased ? theme.colors.onSurfaceDisabled : theme.colors.onPrimary}
              containerColor={isPurchased ? theme.colors.surfaceDisabled : theme.colors.primary}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
};
