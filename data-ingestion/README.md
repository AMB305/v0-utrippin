# Data Ingestion Script

This directory contains the script to ingest travel knowledge into Supabase with vector embeddings.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy `.env.example` to `.env` and fill in your API keys:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the `.env` file with your actual keys:
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (starts with eyJh...)
- `GEMINI_API_KEY`: Your Google Gemini API key

## Usage

Run the ingestion script:
\`\`\`bash
npm start
\`\`\`

## Notes

- The destination_knowledge table uses VECTOR(768) for text-embedding-gecko@001
- If using gemini-embedding-001, update the table to VECTOR(3072)
- Service role key has elevated privileges - keep it secure
