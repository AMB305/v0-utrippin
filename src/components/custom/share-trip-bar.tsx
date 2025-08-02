export const ShareTripBar = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Trip link copied to clipboard!');
  };

  return (
    <div className="bg-zinc-800 p-3 rounded-xl /* large rounded corners */ flex items-center justify-between text-sm text-white /* main text color: white */ shadow">
      <div>
        ✈️ Planning a trip? <span className="text-teal-400 /* accent text color */">Invite a Travel Buddy</span>
      </div>
      <button
        className="ml-4 bg-teal-600 /* primary CTA background */ hover:bg-teal-700 text-white /* main text color: white */ px-3 py-1 rounded"
        onClick={handleCopyLink}
      >
        Share
      </button>
    </div>
  );
};
