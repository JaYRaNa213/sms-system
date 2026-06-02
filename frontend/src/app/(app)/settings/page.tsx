'use client';
import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { settingsService } from '@/services/settings.service';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [senderId, setSenderId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await settingsService.get();
      setCompanyName(data.companyName);
      setSupportEmail(data.supportEmail);
      setSenderId(data.senderId);
    };
    void load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await settingsService.update({ companyName, senderId, supportEmail });
      alert('Settings saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your platform configuration and preferences.</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: 'var(--spacing-4)' }}>Company Information</h3>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Support Email</label>
            <input
              type="email"
              className="form-input"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: 'var(--spacing-4)' }}>SMS Configuration</h3>
          <div className="form-group">
            <label className="form-label">Default Sender ID</label>
            <input
              type="text"
              className="form-input"
              value={senderId}
              maxLength={11}
              onChange={(event) => setSenderId(event.target.value)}
            />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>Max 11 characters. Must be pre-registered in some countries.</span>
          </div>
          
          <div style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Single-provider mock delivery is enabled for local operations.
          </div>
        </div>
      </div>
    </div>
  );
}
