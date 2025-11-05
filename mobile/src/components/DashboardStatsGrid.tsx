import React from 'react';
import { View } from 'react-native';
import { DashboardStatCard } from './DashboardStatCard';
import { dashboardStyles as styles } from './dashboard/styles';

type DashboardStatsGridProps = {
  stats: any[];
  onStatPress?: (stat: any) => void;
};

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ 
  stats, 
  onStatPress 
}) => {
  return (
    <View style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <DashboardStatCard
          key={index}
          value={stat.value}
          label={stat.title}
          subtitle={stat.subtitle}
          icon={stat.icon}
          color={stat.color}
          onPress={stat.onPress || (() => onStatPress?.(stat))}
        />
      ))}
    </View>
  );
};