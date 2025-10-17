import React, { memo, useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { LightPackageCard } from './LightPackageCard';
import { styles } from '../styles';

type PackagesListProps = {
  packages: any[];
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    logoutColor: string;
    primary: string;
    outline: string;
  };
  onEdit: (pkg: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, isActive: boolean, name: string) => void;
};

const PackagesListComponent: React.FC<PackagesListProps> = ({
  packages,
  themeColors,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Progressive rendering: render first 4 items immediately, then rest after delay
  const [itemsToRender, setItemsToRender] = useState(Math.min(4, packages.length));

  useEffect(() => {
    // Reset when packages change
    setItemsToRender(Math.min(4, packages.length));

    if (packages.length > 4) {
      // Use requestAnimationFrame for smooth rendering
      const timeout = requestAnimationFrame(() => {
        setItemsToRender(packages.length);
      });
      return () => cancelAnimationFrame(timeout);
    }
  }, [packages]);

  const visiblePackages = packages.slice(0, itemsToRender);

  return (
    <View style={styles.packagesList}>
      {visiblePackages.map((pkg: any) => (
        <MemoizedPackageItem
          key={pkg.id}
          package={pkg}
          themeColors={themeColors}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </View>
  );
};

type PackageItemProps = {
  package: any;
  themeColors: {
    cardBackground: string;
    onCardBackground: string;
    logoutColor: string;
    primary: string;
    outline: string;
  };
  onEdit: (pkg: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, isActive: boolean, name: string) => void;
};

const PackageItem: React.FC<PackageItemProps> = ({ package: pkg, themeColors, onEdit, onDelete, onToggleActive }) => {
  const handleEdit = useCallback(() => onEdit(pkg), [pkg, onEdit]);
  const handleDelete = useCallback(() => onDelete(pkg.id, pkg.name), [pkg.id, pkg.name, onDelete]);
  const handleToggleActive = useCallback(() => onToggleActive(pkg.id, pkg.isActive, pkg.name), [pkg.id, pkg.isActive, pkg.name, onToggleActive]);

  return (
    <LightPackageCard
      package={pkg}
      themeColors={themeColors}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
    />
  );
};

const MemoizedPackageItem = memo(PackageItem);

export const PackagesList = memo(PackagesListComponent);
