import { LucideIcon } from "lucide-react";

export const EmptyState = ({ Icon, title, message, action }: { Icon: LucideIcon; title: string; message: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-primary" strokeWidth={1.6} />
    </div>
    <h3 className="font-heading font-bold text-lg text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-[260px]">{message}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);