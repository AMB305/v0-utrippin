export interface Destination {
  name: string;
  description: string;
  averagePrice?: number;
  tags?: string[];
}

const destinations: Destination[] = [
  {
    name: "Santorini, Greece",
    description: "Experience the iconic white-washed buildings and stunning sunsets of this volcanic island paradise with blue-domed churches, cliff-side villages, and romantic Mediterranean views.",
    tags: ["Greece", "volcanic island", "sunset", "Mediterranean", "romance"]
  },
  {
    name: "Miami, Florida",
    description: "Vibrant beach city with art deco architecture, world-class dining, and endless nightlife. South Beach features colorful lifeguard towers and crystal-clear waters.",
    tags: ["Florida", "beach", "art deco", "nightlife", "South Beach"]
  },
  {
    name: "Orlando, Florida",
    description: "The theme park capital of the world, home to Disney World, Universal Studios, and magical family adventures with iconic castles and thrilling attractions.",
    tags: ["Florida", "theme parks", "Disney World", "family", "attractions"]
  },
  {
    name: "New York City",
    description: "The city that never sleeps - Broadway shows, world-class museums, and iconic landmarks like Times Square, Central Park, and the Statue of Liberty.",
    tags: ["NYC", "Broadway", "museums", "Times Square", "skyline"]
  },
  {
    name: "Las Vegas, Nevada", 
    description: "Entertainment capital with spectacular shows, casinos, dining, and desert adventures. The Strip features dazzling lights and world-famous hotels.",
    tags: ["Nevada", "entertainment", "casinos", "Strip", "shows"]
  },
  {
    name: "Nashville, Tennessee",
    description: "Music City USA - home to country music, honky-tonk bars, and Southern hospitality. Features the Grand Ole Opry and vibrant music scene.",
    tags: ["Tennessee", "country music", "Grand Ole Opry", "honky-tonk", "music scene"]
  },
  {
    name: "Atlanta, Georgia",
    description: "Southern charm meets modern culture in this bustling hub of history and innovation with beautiful skylines and rich civil rights heritage.",
    tags: ["Georgia", "Southern", "history", "culture", "skyline"]
  },
  {
    name: "Washington, DC",
    description: "The nation's capital featuring world-famous monuments, museums, and political landmarks including the White House, Capitol Building, and Smithsonian museums.",
    tags: ["DC", "monuments", "White House", "Capitol", "Smithsonian"]
  }
];

export default destinations;
