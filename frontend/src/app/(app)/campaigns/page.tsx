'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Play, Users, FileText, Send } from 'lucide-react';
import { templatesService, type Template } from '@/services/templates.service';
import { contactsService, type Contact } from '@/services/contacts.service';
import { campaignsService, type Campaign } from '@/services/campaigns.service';

export default function CampaignsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [templateId, setTemplateId] = useState<number | ''>('');
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingCampaignId, setSendingCampaignId] = useState<number | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === Number(templateId)),
    [templateId, templates],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [templateData, contactData, campaignData] = await Promise.all([
        templatesService.getAll(),
        contactsService.getContacts(1, 1000, ''),
        campaignsService.getAll(),
      ]);
      setTemplates(templateData);
      setContacts(contactData.data);
      setCampaigns(campaignData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (selectedTemplate && !message.trim()) {
      setMessage(selectedTemplate.content);
    }
  }, [selectedTemplate, message]);

  const toggleRecipient = (contactId: number) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    );
  };

  const createCampaign = async () => {
    if (!name.trim() || !message.trim() || selectedContactIds.length === 0) {
      alert('Campaign name, message and at least one recipient are required.');
      return;
    }

    const created = await campaignsService.create({
      name: name.trim(),
      message: message.trim(),
      templateId: templateId ? Number(templateId) : undefined,
      recipientIds: selectedContactIds,
    });

    setCampaigns((prev) => [created, ...prev]);
    setName('');
    setMessage('');
    setTemplateId('');
    setSelectedContactIds([]);
  };

  const sendCampaign = async (campaignId: number) => {
    setSendingCampaignId(campaignId);
    try {
      const result = await campaignsService.send(campaignId);
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === campaignId ? result.campaign : campaign)),
      );
      alert(`Mock SMS sent to ${result.sent} contacts.`);
    } finally {
      setSendingCampaignId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Create campaigns, select recipients and send mock SMS.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>
            <FileText size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Create Campaign
          </h3>
          <div className="form-group">
            <label className="form-label">Campaign Name</label>
            <input className="form-input" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Template</label>
            <select
              className="form-input"
              style={{ appearance: 'auto' }}
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value ? Number(event.target.value) : '')}
            >
              <option value="">Select a template (optional)</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-input"
              style={{ minHeight: '120px' }}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type campaign message..."
            />
          </div>
          <button className="btn btn-primary" onClick={createCampaign} disabled={loading}>
            <Send size={16} /> Create Campaign
          </button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>
            <Users size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Select Contacts ({selectedContactIds.length})
          </h3>
          <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'grid', gap: '8px' }}>
            {contacts.map((contact) => (
              <label
                key={contact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(contact.id)}
                  onChange={() => toggleRecipient(contact.id)}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{contact.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{contact.mobile}</div>
                </div>
              </label>
            ))}
            {contacts.length === 0 && (
              <div style={{ color: 'var(--color-text-muted)' }}>No contacts available. Import contacts first.</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-3)' }}>Campaign List</h3>
        {campaigns.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)' }}>No campaigns created yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'var(--color-bg-dark)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{campaign.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Recipients: {campaign.recipients.length} | Status: {campaign.status}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => sendCampaign(campaign.id)}
                    disabled={campaign.status === 'SENT' || sendingCampaignId === campaign.id}
                  >
                    <Play size={16} />
                    {campaign.status === 'SENT'
                      ? 'Sent'
                      : sendingCampaignId === campaign.id
                        ? 'Sending...'
                        : 'Send'}
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{campaign.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
