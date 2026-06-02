'use client';
import React, { useEffect, useState } from 'react';
import { analyticsService, type AnalyticsSummary } from '@/services/analytics.service';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await analyticsService.getSummary();
      setSummary(data);
    };
    void load();
  }, []);

  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Basic SMS activity summary for admin operations.</p>
      
      <div className="grid-3">
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Total Contacts</h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)' }}>{summary?.totalContacts ?? '-'}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Total Campaigns</h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)' }}>{summary?.totalCampaigns ?? '-'}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Total SMS Sent</h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)' }}>{summary?.totalSms ?? '-'}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Delivered</h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>{summary?.delivered ?? '-'}</div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Failed</h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-danger)' }}>{summary?.failed ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}
