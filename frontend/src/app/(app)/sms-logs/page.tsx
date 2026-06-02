'use client';
import React, { useEffect, useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { smsService, type SmsLog } from '@/services/sms.service';

export default function SMSLogsPage() {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await smsService.getLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };
    void loadLogs();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">SMS Logs</h1>
          <p className="page-subtitle">Track individual message delivery status and history.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-2)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search mobile, message..." style={{ paddingLeft: '36px' }} />
          </div>
          <select className="form-input" style={{ width: '150px', appearance: 'auto' }}>
            <option>All Statuses</option>
            <option>Delivered</option>
            <option>Failed</option>
            <option>Sent</option>
          </select>
          <button className="btn btn-outline"><Filter size={16} /> More Filters</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Recipient</th>
                <th style={{ padding: '12px 16px' }}>Message Preview</th>
                <th style={{ padding: '12px 16px' }}>Campaign</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', color: 'var(--color-text-muted)' }}>Loading SMS logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', color: 'var(--color-text-muted)' }}>No SMS logs yet.</td>
                </tr>
              ) : logs.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {row.status === 'DELIVERED' && <CheckCircle size={16} color="var(--color-success)" />}
                      {row.status === 'FAILED' && <AlertCircle size={16} color="var(--color-danger)" />}
                      {row.status === 'SENT' && <Clock size={16} color="var(--color-warning)" />}
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 
                        row.status === 'DELIVERED' ? 'var(--color-success)' :
                        row.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-warning)'
                      }}>{row.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>{row.mobile}</td>
                  <td style={{ padding: '16px', fontSize: '13px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.message}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', fontSize: '12px' }}>
                      {row.campaign?.name ?? 'Direct SMS'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
