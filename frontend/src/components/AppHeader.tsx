'use client';
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search contacts, campaigns..." 
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.actions}>
        <div className={styles.providerInfo}>
          <span className={styles.label}>Provider:</span>
          <span className={styles.value}>Twilio</span>
          <span className={styles.divider}></span>
          <span className={styles.label}>Sender:</span>
          <span className={styles.value}>SENDER_ID</span>
        </div>
        
        <button className={styles.iconButton}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profileMenu}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
