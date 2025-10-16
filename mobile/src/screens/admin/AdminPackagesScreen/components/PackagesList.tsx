import React from 'react';
import { View } from 'react-native';
import { PackageCard } from './PackageCard';
import { styles } from '../styles';

type PackagesListProps = {
  packages: any[];
  onEdit: (pkg: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, isActive: boolean, name: string) => void;
};

export const PackagesList: React.FC<PackagesListProps> = ({
  packages,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <View style={styles.packagesList}>
      {packages.map((pkg: any) => (
        <PackageCard
          key={pkg.id}
          package={pkg}
          onEdit={() => onEdit(pkg)}
          onDelete={() => onDelete(pkg.id, pkg.name)}
          onToggleActive={() => onToggleActive(pkg.id, pkg.isActive, pkg.name)}
        />
      ))}
    </View>
  );
};
