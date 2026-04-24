import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

export const AppLayout = ({ hideHeader = false, hideNav = false }: { hideHeader?: boolean; hideNav?: boolean }) => {
  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <AppHeader />}
      <main className="max-w-7xl mx-auto pb-[88px] md:pb-12 min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};