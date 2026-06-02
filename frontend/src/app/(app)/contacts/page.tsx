'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Download, Upload, X, FileSpreadsheet } from 'lucide-react';
import { useContactStore } from '@/store/contactStore';
import { contactsService } from '@/services/contacts.service';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function ContactsPage() {
  const { contacts, total, page, limit, totalPages, loading, search, fetchContacts, setSearch } = useContactStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Form State
  const [newContact, setNewContact] = useState({ name: '', mobile: '', tags: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContacts(1, limit, '');
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchContacts(1, limit, val);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactsService.createContact({
        name: newContact.name,
        mobile: newContact.mobile,
        tags: newContact.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setShowAddModal(false);
      setNewContact({ name: '', mobile: '', tags: '' });
      fetchContacts(1, limit, search);
    } catch (err) {
      console.error(err);
      alert('Failed to add contact');
    }
  };

  const processImportedData = async (data: any[]) => {
    try {
      const formattedContacts = data.map(row => ({
        name: row.name || row.Name || '',
        mobile: row.mobile || row.Mobile || row.phone || row.Phone || '',
        tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : []
      })).filter(c => c.name && c.mobile);

      if (formattedContacts.length > 0) {
        await contactsService.importContacts(formattedContacts);
        alert(`Successfully imported ${formattedContacts.length} contacts!`);
        setShowImportModal(false);
        fetchContacts(1, limit, search);
      } else {
        alert('No valid contacts found. Please ensure headers are "name" and "mobile".');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to import contacts.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processImportedData(results.data);
        }
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        processImportedData(data);
      };
      reader.readAsBinaryString(file);
    } else {
      alert('Unsupported file format. Please upload CSV or Excel.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await contactsService.deleteContact(id);
      fetchContacts(page, limit, search);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your audience and contact lists.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn btn-outline" onClick={() => alert('Exporting...')}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-outline" onClick={() => setShowImportModal(true)}>
            <Upload size={16} /> Import
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Contact
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', width: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by name or mobile..." 
                style={{ paddingLeft: '36px' }}
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Showing {contacts.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)} of {total}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', minHeight: '400px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No contacts found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px', width: '40px' }}><input type="checkbox" /></th>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Mobile</th>
                  <th style={{ padding: '12px 16px' }}>Tags</th>
                  <th style={{ padding: '12px 16px' }}>Created</th>
                  <th style={{ padding: '12px 16px', width: '80px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px' }}><input type="checkbox" /></td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg-dark)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          {row.name.charAt(0).toUpperCase()}
                        </div>
                        {row.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>{row.mobile}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {row.tags.map(tag => (
                          <span key={tag} style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--color-primary)', color: 'white', fontSize: '10px', opacity: 0.8 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(row.id)} style={{ color: 'var(--color-danger)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '12px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div style={{ padding: 'var(--spacing-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)' }}>
          <button 
            className="btn btn-outline" 
            disabled={page === 1}
            onClick={() => fetchContacts(page - 1, limit, search)}
          >
            Previous
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
          </div>
          <button 
            className="btn btn-outline" 
            disabled={page >= totalPages}
            onClick={() => fetchContacts(page + 1, limit, search)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Add New Contact</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" className="form-input" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input required type="text" className="form-input" value={newContact.mobile} onChange={e => setNewContact({...newContact, mobile: e.target.value})} placeholder="+1234567890" />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input type="text" className="form-input" value={newContact.tags} onChange={e => setNewContact({...newContact, tags: e.target.value})} placeholder="VIP, Newsletter" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 'var(--spacing-4)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Import Contacts</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} onClick={() => setShowImportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', border: '2px dashed var(--color-border)', borderRadius: '8px', marginBottom: 'var(--spacing-4)' }}>
              <FileSpreadsheet size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Upload CSV or Excel File</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Ensure your file has headers: "name", "mobile", "tags".
              </p>
              <input 
                type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                Select File
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowImportModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
