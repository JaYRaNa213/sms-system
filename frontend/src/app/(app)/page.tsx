'use client';
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Users, Send, CheckCircle, AlertTriangle, Clock, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of your SMS platform performance.</p>

      <div className="grid-4" style={{ marginBottom: 'var(--spacing-4)' }}>
        <DashboardCard title="Total Contacts" value="12,405" icon={<Users size={20} />} trend={{ value: 12.5, isPositive: true }} />
        <DashboardCard title="SMS Sent (MTD)" value="845,210" icon={<Send size={20} />} trend={{ value: 8.2, isPositive: true }} />
        <DashboardCard title="Delivery Rate" value="98.2%" icon={<CheckCircle size={20} />} trend={{ value: 0.5, isPositive: true }} />
        <DashboardCard title="Failed SMS" value="1,204" icon={<AlertTriangle size={20} />} trend={{ value: 2.1, isPositive: false }} />
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>SMS Volume Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                />
                <Area type="monotone" dataKey="volume" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>Delivery Performance</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="delivered" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h3 style={{ fontSize: '16px', margin: 0 }}>Recent Campaigns</h3>
          <button className="btn btn-outline">View All</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Campaign Name</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Recipients</th>
                <th style={{ padding: '12px 16px' }}>Delivered</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Q3 Promo Blast', status: 'Completed', rec: '12,000', del: '99.1%', date: 'Oct 24, 2024' },
                { name: 'Weekly Newsletter', status: 'Sending', rec: '45,200', del: '45.0%', date: 'Oct 25, 2024' },
                { name: 'Alert: System Maintenance', status: 'Scheduled', rec: '1,200', del: '-', date: 'Oct 26, 2024' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      background: row.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 
                                  row.status === 'Sending' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: row.status === 'Completed' ? 'var(--color-success)' : 
                             row.status === 'Sending' ? 'var(--color-primary)' : 'var(--color-warning)'
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{row.rec}</td>
                  <td style={{ padding: '16px' }}>{row.del}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
