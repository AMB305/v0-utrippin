// data-ingestion/ingest_data.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // This is the service_role key

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Error: Missing environment variables. Please check your .env file.");
    process.exit(1); // Exit if essential variables are missing
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!); // Use ! for non-null assertion as we checked above

// IMPORTANT: Choose your embedding model and its correct dimensionality.
// Verify this matches the VECTOR() size in your Supabase 'destination_knowledge' table.
const EMBEDDING_MODEL = "embedding-001"; // A common Google text embedding model
const EMBEDDING_DIMENSION = 768; // Its typical output dimension

async function getGoogleEmbedding(text: string, taskType: string = "RETRIEVAL_DOCUMENT"): Promise<number[] | null> {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      taskType: taskType,
      // outputDimensionality: EMBEDDING_DIMENSION, // Optional: Can be specified to ensure desired output dim
    });
    return result.embedding.values;
  } catch (error) {
    console.error(`Error generating embedding for "${text.substring(0, 50)}...":`, error);
    return null;
  }
}

interface KnowledgeChunk {
    destination_name: string;
    category: string;
    content: string;
}

// THIS IS WHERE YOU'LL ADD YOUR KNOWLEDGE BASE CONTENT
const allKnowledgeData: KnowledgeChunk[] = [
    // --- UNITED STATES EXAMPLES ---
    {
        destination_name: "Miami",
        category: "overview",
        content: "Miami is a major coastal city in southeastern Florida, known for its vibrant culture, beautiful beaches, and iconic Art Deco architecture. It's a hub for international finance, commerce, culture, arts, and fashion."
    },
    {
        destination_name: "Miami",
        category: "attractions",
        content: "Top attractions in Miami include South Beach for its nightlife and sandy shores, Ocean Drive with its Art Deco buildings, Vizcaya Museum & Gardens, and the colorful street art of Wynwood Walls."
    },
    {
        destination_name: "Miami",
        category: "food",
        content: "Miami's culinary scene is heavily influenced by Cuban and Latin American flavors. Must-try dishes include Cuban sandwiches, ceviche, and stone crab claws during season. Explore areas like Little Havana for authentic cuisine."
    },
    {
        destination_name: "New York City",
        category: "overview",
        content: "New York City, often called NYC, is the most populous city in the United States and a global epicenter of finance, fashion, art, and media. Its five boroughs each offer distinct experiences."
    },
    {
        destination_name: "New York City",
        category: "attractions",
        content: "Iconic NYC attractions include Times Square's dazzling billboards, the tranquil Central Park, the historical Statue of Liberty, the breathtaking views from the Empire State Building, and world-class Broadway shows."
    },
    {
        destination_name: "New York City",
        category: "food",
        content: "From gourmet restaurants to street food, NYC offers unparalleled dining diversity. Sample New York-style pizza, bagels, and cheesecake. Explore diverse culinary neighborhoods like Flushing (Queens) or the Lower East Side."
    },
    {
        destination_name: "Orlando",
        category: "overview",
        content: "Orlando, Florida, is a world-renowned city in central Florida, primarily famous for its theme parks and entertainment attractions. It's a top global tourist destination, especially for families."
    },
    {
        destination_name: "Orlando",
        category: "families",
        content: "Orlando is the ultimate family destination. Highlights include Walt Disney World Resort (Magic Kingdom, Epcot, Hollywood Studios, Animal Kingdom), Universal Orlando Resort (Universal Studios Florida, Islands of Adventure), and SeaWorld Orlando."
    },
    {
        destination_name: "Los Angeles",
        category: "overview",
        content: "Los Angeles, a sprawling Southern California city, is the center of the nation's film and television industry. Known for its Mediterranean climate, diverse culture, and Hollywood glamour."
    },
    {
        destination_name: "Los Angeles",
        category: "attractions",
        content: "Major attractions in LA include the Hollywood Walk of Fame, Griffith Observatory with its stunning city views, Universal Studios Hollywood, Disneyland (in nearby Anaheim), and the beautiful Santa Monica Pier."
    },
    {
        destination_name: "Chicago",
        category: "overview",
        content: "Chicago, Illinois, is a major city in the U.S. Midwest, located on the shores of freshwater Lake Michigan. It's famous for its bold architecture, vibrant arts scene, and deep-dish pizza."
    },
    {
        destination_name: "Chicago",
        category: "attractions",
        content: "Don't miss the Willis Tower Skydeck, Millennium Park (Cloud Gate 'The Bean'), Art Institute of Chicago, Navy Pier, and architectural boat tours in Chicago."
    },
    // --- INTERNATIONAL EXAMPLES (EXPAND HERE TOO!) ---
    {
        destination_name: "Paris",
        category: "overview",
        content: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine."
    },
    {
        destination_name: "Tokyo",
        category: "overview",
        content: "Tokyo, Japan's bustling capital, mixes the traditional with the ultra-modern, from serene ancient temples to neon-lit skyscrapers. It's known for its vibrant street life, culinary excellence, and cutting-edge technology."
    },
    // You will significantly expand this `allKnowledgeData` array!
];

async function ingestAllKnowledge() {
    console.log(`Starting ingestion of ${allKnowledgeData.length} knowledge chunks...`);
    for (const item of allKnowledgeData) {
        process.stdout.write(`Generating embedding for "${item.destination_name} - ${item.category}"... `);
        const embedding = await getGoogleEmbedding(item.content, "RETRIEVAL_DOCUMENT");
        
        if (embedding) {
            const { error } = await supabase.from('destination_knowledge').insert({
                destination_name: item.destination_name,
                category: item.category,
                content: item.content,
                embedding: embedding
            });

            if (error) {
                console.error(`\nError inserting data for ${item.destination_name} - ${item.category}:`, error.message);
            } else {
                console.log(`[OK] Successfully inserted.`);
            }
        } else {
            console.warn(`[FAIL] Failed to generate embedding for: ${item.destination_name} - ${item.category}. Skipping.`);
        }
    }
    console.log("\n--- Ingestion complete! ---");
}

// Execute the ingestion function
ingestAllKnowledge().catch(console.error);
