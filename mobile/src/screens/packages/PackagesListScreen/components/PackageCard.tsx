import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useTheme } from '../../../../contexts/ThemeContext';
import { styles } from '../styles';

type PackageCardProps = {
  package: {
    id: string;
    name: string;
    description: string;
    price: number;
    courses?: any[];
  };
  isPurchased?: boolean;
  showBuyButton?: boolean;
  onBuy?: () => void;
};

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  isPurchased,
  showBuyButton,
  onBuy,
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.packageCard, { backgroundColor: theme.colors.cardBackground }]}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.packageTitle}>
          {pkg.name}
        </Text>
        <Text style={styles.packageDesc}>{pkg.description}</Text>
        <View style={styles.chipContainer}>
          <Chip icon="currency-eur" compact style={styles.chip}>
            {pkg.price.toFixed(2)} €
          </Chip>
          <Chip icon="book-multiple" compact style={styles.chip}>
            {pkg.courses?.length || 0} cours
          </Chip>
        </View>
        {showBuyButton && (
          <Button
            mode="contained"
            onPress={onBuy}
            disabled={isPurchased}
            style={styles.buyButton}
          >
            {isPurchased ? 'Déjà acheté' : 'Acheter'}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};
