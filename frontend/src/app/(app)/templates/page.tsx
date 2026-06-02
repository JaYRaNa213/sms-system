'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash, MessageSquare } from 'lucide-react';
import { templatesService, type Template } from '@/services/templates.service';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId],
  );

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templatesService.getAll();
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplateId((prev) => prev ?? data[0].id);
      } else {
        setSelectedTemplateId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  const createTemplate = async () => {
    if (!name.trim() || !content.trim()) {
      alert('Template name and content are required.');
      return;
    }

    setSaving(true);
    try {
      const created = await templatesService.create({
        name: name.trim(),
        content: content.trim(),
      });
      setTemplates((prev) => [created, ...prev]);
      setSelectedTemplateId(created.id);
      setName('');
      setContent('');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm('Delete this template?')) {
      return;
    }

    await templatesService.remove(id);
    const nextTemplates = templates.filter((template) => template.id !== id);
    setTemplates(nextTemplates);
    setSelectedTemplateId(nextTemplates[0]?.id ?? null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">Manage reusable message templates with dynamic variables.</p>
        </div>
        <button className="btn btn-primary" onClick={createTemplate} disabled={saving}>
          <Plus size={16} /> {saving ? 'Saving...' : 'New Template'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
        <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-muted)' }}>Loading templates...</div>
          ) : templates.length === 0 ? (
            <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-muted)' }}>No templates yet.</div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                style={{
              padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
              background: selectedTemplate?.id === template.id ? 'rgba(37,99,235,0.05)' : 'transparent',
              borderLeft: selectedTemplate?.id === template.id ? '3px solid var(--color-primary)' : '3px solid transparent',
            }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>{template.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {template.content}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
            <label className="form-label">Template Name</label>
            <input
              className="form-input"
              placeholder="e.g. Welcome Offer"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
            <label className="form-label">Template Content</label>
            <textarea
              className="form-input"
              style={{ minHeight: '110px' }}
              placeholder="Enter SMS template content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          {selectedTemplate ? (
            <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{selectedTemplate.name}</h2>
            <button
              className="btn btn-outline"
              style={{ padding: '6px 10px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              onClick={() => deleteTemplate(selectedTemplate.id)}
            >
              <Trash size={14} />
            </button>
          </div>

          <div className="form-group">
            <div style={{ 
              background: 'var(--color-bg-dark)', padding: '16px', borderRadius: '8px', 
              border: '1px solid var(--color-border)', fontSize: '14px', lineHeight: 1.6, minHeight: '120px'
            }}>
              {selectedTemplate.content}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <span>{selectedTemplate.content.length} characters</span>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-5)', padding: '16px', background: 'var(--color-bg-dark)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={16} color="var(--color-text-muted)" />
              <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>Live Preview (Mobile)</h4>
            </div>
            <div style={{ background: 'var(--color-primary)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.5 }}>
              {selectedTemplate.content}
            </div>
          </div>
            </>
          ) : (
            <div style={{ color: 'var(--color-text-muted)' }}>Select a template to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
}
