import { Shield } from "lucide-react";

export const Cyber50Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50 rounded-lg"></div>
        <div className="relative h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Shield className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">CYBER50</span>
          <span className="text-foreground ml-1">DEFENSE</span>
        </h1>
        <p className="text-xs text-muted-foreground tracking-wide uppercase">
          Tender Intelligence
        </p>
      </div>
    </div>
  );
};
