-- Create table for destination knowledge with embeddings
CREATE TABLE public.destination_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_name TEXT NOT NULL,
    category TEXT, -- e.g., "restaurants", "attractions", "facts"
    content TEXT NOT NULL, -- The actual text about the destination
    embedding VECTOR(768), -- Using 768 dimensions for text-embedding-gecko@001
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.destination_knowledge ENABLE ROW LEVEL SECURITY;

-- Create policies for destination knowledge
CREATE POLICY "Destination knowledge is publicly readable" 
ON public.destination_knowledge 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage destination knowledge" 
ON public.destination_knowledge 
FOR ALL 
USING (true);

-- Add index for efficient similarity search using HNSW with cosine similarity
CREATE INDEX destination_knowledge_embedding_idx 
ON public.destination_knowledge 
USING hnsw (embedding vector_cosine_ops);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_destination_knowledge_updated_at
BEFORE UPDATE ON public.destination_knowledge
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
