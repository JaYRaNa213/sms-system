import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      <AppSidebar />
      <div className="main-content">
        <AppHeader />
        <main className="scroll-area">{children}</main>
      </div>
    </div>
  );
}
