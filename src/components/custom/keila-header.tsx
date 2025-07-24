import { Sparkles } from 'lucide-react';

export const KeilaHeader = () => {
  return (
    <header className="bg-zinc-950 text-white /* main text color: white */ py-4 px-6 border-b border-zinc-800 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-lg font-bold">
          <img 
            src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
            alt="Keila Bot" 
            className="w-8 h-8 animate-pulse"
          />
          Hi there! I'm Keila
        </div>
        <div className="text-sm text-zinc-400 /* muted timestamp or helper text */">Plan. Share. Go.</div>
      </div>
    </header>
  );
};