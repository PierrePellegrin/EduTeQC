import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { PackageCard } from './PackageCard';
import { styles } from '../styles';

type PackagesListProps = {
  packages: any[];
  onEdit: (pkg: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, isActive: boolean, name: string) => void;
};

const PackagesListComponent: React.FC<PackagesListProps> = ({
  packages,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <View style={styles.packagesList}>
      {packages.map((pkg: any) => (
        <MemoizedPackageItem
          key={pkg.id}
          package={pkg}
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
  onEdit: (pkg: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, isActive: boolean, name: string) => void;
};

const PackageItem: React.FC<PackageItemProps> = ({ package: pkg, onEdit, onDelete, onToggleActive }) => {
  const handleEdit = useCallback(() => onEdit(pkg), [pkg, onEdit]);
  const handleDelete = useCallback(() => onDelete(pkg.id, pkg.name), [pkg.id, pkg.name, onDelete]);
  const handleToggleActive = useCallback(() => onToggleActive(pkg.id, pkg.isActive, pkg.name), [pkg.id, pkg.isActive, pkg.name, onToggleActive]);

  return (
    <PackageCard
      package={pkg}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={handleToggleActive}
    />
  );
};

const MemoizedPackageItem = memo(PackageItem);

export const PackagesList = memo(PackagesListComponent);
