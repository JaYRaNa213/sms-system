'use client';
import React, { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Users, Send, CheckCircle, AlertTriangle, Clock, BarChart2, FileText, Smartphone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { dashboardService, DashboardSummary } from '@/services/dashboard.service';

const data = [
  { name: 'Mon', volume: 4000, delivered: 3800 },
  { name: 'Tue', volume: 3000, delivered: 2900 },
  { name: 'Wed', volume: 2000, delivered: 1950 },
  { name: 'Thu', volume: 2780, delivered: 2700 },
  { name: 'Fri', volume: 1890, delivered: 1800 },
  { name: 'Sat', volume: 2390, delivered: 2200 },
  { name: 'Sun', volume: 3490, delivered: 3300 },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getSummary();
        setSummary(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p className="page-subtitle">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-error)' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p className="page-subtitle">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of your SMS platform performance.</p>

      <div className="grid-4" style={{ marginBottom: 'var(--spacing-4)' }}>
        <DashboardCard title="Total Contacts" value={formatNumber(summary.totalContacts)} icon={<Users size={20} />} trend={{ value: 0, isPositive: true }} />
        <DashboardCard title="Total Templates" value={formatNumber(summary.totalTemplates)} icon={<FileText size={20} />} trend={{ value: 0, isPositive: true }} />
        <DashboardCard title="Total Campaigns" value={formatNumber(summary.totalCampaigns)} icon={<BarChart2 size={20} />} trend={{ value: 0, isPositive: true }} />
        <DashboardCard title="Total SMS Sent" value={formatNumber(summary.totalSmsSent)} icon={<Send size={20} />} trend={{ value: 0, isPositive: true }} />
        <DashboardCard title="Delivered SMS" value={formatNumber(summary.delivered)} icon={<CheckCircle size={20} />} trend={{ value: 0, isPositive: true }} />
        <DashboardCard title="Failed SMS" value={formatNumber(summary.failed)} icon={<AlertTriangle size={20} />} trend={{ value: 0, isPositive: false }} />
        <DashboardCard title="Pending SMS" value={formatNumber(summary.pending)} icon={<Clock size={20} />} trend={{ value: 0, isPositive: true }} />
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>Latest Campaign</h3>
          {summary.latestCampaign ? (
            <div>
              <p><strong>Name:</strong> {summary.latestCampaign.name}</p>
              <p><strong>Status:</strong> {summary.latestCampaign.status}</p>
              <p><strong>Date:</strong> {new Date(summary.latestCampaign.createdAt).toLocaleDateString()}</p>
              <p><strong>Message:</strong> {summary.latestCampaign.message}</p>
            </div>
          ) : (
            <p className="page-subtitle">No campaigns yet.</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>Latest SMS Activity</h3>
          {summary.latestSmsLog ? (
            <div>
              <p><strong>To:</strong> {summary.latestSmsLog.mobile}</p>
              <p><strong>Status:</strong> {summary.latestSmsLog.status}</p>
              <p><strong>Date:</strong> {new Date(summary.latestSmsLog.createdAt).toLocaleString()}</p>
              <p><strong>Message:</strong> {summary.latestSmsLog.message}</p>
            </div>
          ) : (
            <p className="page-subtitle">No SMS activity yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
