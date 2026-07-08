import { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: ReactNode; // Breadcrumbs or text
  action?: ReactNode; // Button or link
}

export function PageHeader({ icon, title, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center gap-3">
        {icon}
        {title}
      </div>
      {action}
    </header>
  );
}
