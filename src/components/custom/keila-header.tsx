import { Sparkles } from 'lucide-react';

export const KeilaHeader = () => {
  return (
    <header className="bg-zinc-950 text-white /* main text color: white */ py-4 px-6 border-b border-zinc-800 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-lg font-bold">
          <Sparkles className="text-teal-400 /* accent text color */" />
          Keila Travel AI
        </div>
        <div className="text-sm text-zinc-400 /* muted timestamp or helper text */">Plan. Share. Go.</div>
      </div>
    </header>
  );
};