import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';

const KeilaPreviewer: React.FC = () => {
  const [city, setCity] = useState('Cancun');
  const [date, setDate] = useState('2025-09-02');
  const [budget, setBudget] = useState(2000);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItinerary = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('call-gemini-formatted-itinerary', {
      body: { city, date, budget }
    });
    setMarkdown(data.markdown);
    setLoading(false);
  };

  const downloadPDF = () => {
    const element = document.getElementById('markdown-preview');
    html2pdf().from(element).save(`${city}_keila_itinerary.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-foreground">
      <h2 className="text-2xl font-bold mb-4">🧭 Keila AI Travel Assistant</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          className="text-foreground bg-background border border-border p-2 rounded" 
          placeholder="City" 
        />
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          className="text-foreground bg-background border border-border p-2 rounded" 
        />
        <input 
          type="number" 
          value={budget} 
          onChange={e => setBudget(Number(e.target.value))} 
          className="text-foreground bg-background border border-border p-2 rounded" 
          placeholder="Budget" 
        />
        <button 
          onClick={fetchItinerary} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          {loading ? "🌀 Keila is planning..." : "Generate"}
        </button>
      </div>

      {markdown && (
        <>
          <div className="flex gap-4 mb-4">
            <a 
              href="https://www.expedia.com/Flights?siteid=1&clickref=1100lBkVXSGk" 
              target="_blank" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Book Flights
            </a>
            <a 
              href="https://www.expedia.com/Hotels?siteid=1&clickref=1100lBkVXSGk" 
              target="_blank" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Book Hotels
            </a>
            <button 
              onClick={downloadPDF} 
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              Download PDF
            </button>
          </div>

          <div id="markdown-preview" className="bg-card text-card-foreground p-6 rounded-lg shadow border prose max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-table:text-foreground">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold border-b border-border pb-2 mb-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-primary mb-3" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-lg font-medium mb-2" {...props} />,
                table: ({ node, ...props }) => <table className="table-auto border-collapse border border-border w-full my-4" {...props} />,
                th: ({ node, ...props }) => <th className="border border-border bg-muted p-2 font-semibold" {...props} />,
                td: ({ node, ...props }) => <td className="border border-border p-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-1" {...props} />,
                a: ({ node, ...props }) => <a className="text-primary hover:text-primary/80 underline" {...props} />
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
};

export default KeilaPreviewer;
