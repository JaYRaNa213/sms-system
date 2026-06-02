'use client';
import React, { useState } from 'react';
import { MessageSquare, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@localhost.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      login(response.data.user, response.data.access_token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'var(--color-bg-dark)',
      zIndex: 1000,
      display: 'flex'
    }}>
      <div style={{
        flex: 1,
        backgroundColor: 'var(--color-bg-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--spacing-6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(40px)' }}></div>
        
        <div style={{ maxWidth: '480px', margin: '0 auto', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <MessageSquare size={32} color="var(--color-primary)" style={{ marginRight: '12px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>SMS Platform</h1>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: 'var(--spacing-2)', lineHeight: 1.2 }}>Enterprise messaging,<br/>simplified.</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', marginBottom: 'var(--spacing-5)' }}>
            Connect with your audience globally with industry-leading delivery rates and analytics.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <div style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
            <div style={{ padding: '4px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
            <div style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-4)'
      }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-5)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: 'var(--spacing-1)' }}>Welcome back</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-4)', fontSize: '14px' }}>Please enter your details to sign in.</p>
          
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', 
              color: 'var(--color-danger)', padding: '12px', borderRadius: '8px', 
              fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' 
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="admin@localhost.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Admin access</span>
              </div>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px' }} disabled={loading}>
              {loading ? 'Signing In...' : (
                <>Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} /></>
              )}
            </button>
          </form>
          
          <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Single-admin login enabled
          </div>
        </div>
      </div>
    </div>
  );
}
