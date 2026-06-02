import React from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="card">
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.valueContainer}>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}
