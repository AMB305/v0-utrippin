// Temporary script to trigger comprehensive destination scraping
import { supabase } from './src/integrations/supabase/client.js';

async function triggerScraping() {
  console.log('🚀 Starting comprehensive destination scraping...');
  
  try {
    const { data, error } = await supabase.functions.invoke('scrape-destinations', {
      body: { scrape_all: true }
    });
    
    if (error) {
      console.error('❌ Scraping failed:', error);
      return;
    }
    
    console.log('✅ Scraping completed successfully:', data);
  } catch (err) {
    console.error('❌ Error during scraping:', err);
  }
}

// Run the scraping
triggerScraping();