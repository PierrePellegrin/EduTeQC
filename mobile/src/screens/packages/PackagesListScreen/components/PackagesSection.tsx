import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { PackageCard } from './PackageCard';
import { styles } from '../styles';

type PackagesSectionProps = {
  packages: any[];
  isPurchasedSection?: boolean;
  userPackages?: any[];
  onBuy?: (packageId: string) => void;
};

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  isPurchasedSection,
  userPackages,
  onBuy,
}) => {
  return (
    <View>
      {packages.length === 0 && isPurchasedSection && (
        <Text style={styles.emptyText}>Aucun package acheté.</Text>
      )}
      {packages.map((pkg: any) => (
        <PackageCard
          key={pkg.id}
          package={isPurchasedSection ? pkg.package : pkg}
          isPurchased={userPackages?.some((up: any) => up.packageId === pkg.id)}
          showBuyButton={!isPurchasedSection}
          onBuy={() => onBuy && onBuy(pkg.id)}
        />
      ))}
    </View>
  );
};
