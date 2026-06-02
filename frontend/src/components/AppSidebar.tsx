'use client';
import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Send, 
  List, 
  BarChart3, 
  Settings, 
  Moon, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import styles from './AppSidebar.module.css';

const navItems = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Contacts', href: '/contacts', icon: <Users size={20} /> },
  { name: 'Templates', href: '/templates', icon: <FileText size={20} /> },
  { name: 'Campaigns', href: '/campaigns', icon: <Send size={20} /> },
  { name: 'SMS Logs', href: '/sms-logs', icon: <List size={20} /> },
  { name: 'Analytics', href: '/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export default function AppSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <MessageSquare className={styles.logoIcon} size={28} />
        <span className={styles.logoText}>SMS Platform</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className={styles.navLink}>
            {item.icon}
            <span className={styles.navText}>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.bottomNav}>
        <button className={styles.navLink}>
          <Moon size={20} />
          <span className={styles.navText}>Dark Mode</span>
        </button>
        <button className={styles.navLink}>
          <LogOut size={20} />
          <span className={styles.navText}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
