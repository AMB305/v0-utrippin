import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../components/ui/button";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function TravelBuddy() {
  const [userId, setUserId] = useState(null); // replace with auth user id
  const [buddies, setBuddies] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const demoUserId = "00000000-0000-0000-0000-000000000001"; // swap for your auth id
    setUserId(demoUserId);
    fetchBuddies(demoUserId);
    fetchMatches(demoUserId);
  }, []);

  async function fetchBuddies(id) {
    const { data } = await supabase.rpc("get_potential_travel_buddies", { current_user: id });
    setBuddies(data);
  }

  async function fetchMatches(id) {
    const { data } = await supabase.rpc("get_user_matches", { current_user: id });
    setMatches(data);
  }

  async function swipe(swipedId, liked) {
    await supabase.rpc("record_swipe", {
      swiper: userId,
      swiped: swipedId,
      liked
    });
    fetchBuddies(userId);
    fetchMatches(userId);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#003C8A]">Find Travel Buddies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {buddies.map(buddy => (
          <div key={buddy.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <img src={buddy.avatar_url} alt={buddy.username} className="w-24 h-24 rounded-full mb-4" />
            <h3 className="text-xl font-semibold mb-2">{buddy.username}</h3>
            <p className="text-gray-600 mb-4">{buddy.bio}</p>
            <div className="flex space-x-2">
              <Button onClick={() => swipe(buddy.id, true)} className="bg-green-600 hover:bg-green-700 text-white flex-1">👍 Like</Button>
              <Button onClick={() => swipe(buddy.id, false)} className="bg-red-600 hover:bg-red-700 text-white flex-1">👎 Pass</Button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-[#0068EF]">Your Matches</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {matches.map(match => (
          <div key={match.id} className="border p-4 rounded shadow flex flex-col items-center">
            <img src={match.avatar_url} alt={match.username} className="w-16 h-16 rounded-full mb-2" />
            <div className="font-medium">{match.username}</div>
            <div className="text-sm text-gray-500">{match.bio}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
