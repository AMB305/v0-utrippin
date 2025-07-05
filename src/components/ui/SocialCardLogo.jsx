import React from "react";

// Special version of the logo specifically for social cards
// This is larger and more prominent than the regular logo
export default function SocialCardLogo() {
  const letters = [
    { char: "U", color: "bg-[#0068EF]", hover: "hover:bg-[#338ef7]" },
    { char: "T", color: "bg-[#005FCF]", hover: "hover:bg-[#337ed7]" },
    { char: "R", color: "bg-[#004FB0]", hover: "hover:bg-[#336eb0]" },
    { char: "I", color: "bg-[#004092]", hover: "hover:bg-[#335e92]" },
    { char: "P", color: "bg-[#003073]", hover: "hover:bg-[#334e73]" },
    { char: "P", color: "bg-[#002155]", hover: "hover:bg-[#333e55]" },
    { char: "I", color: "bg-[#001137]", hover: "hover:bg-[#332e37]" },
    { char: "N", color: "bg-[#000218]", hover: "hover:bg-[#331e18]" },
  ];

  return (
    <div className="flex items-center space-x-3 animate-pulse-gradient">
      {letters.map((item, idx) => (
        <div
          key={idx}
          className={`${item.color} w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
          flex items-center justify-center rounded-md transition duration-300 
          hover:shadow-md hover:-translate-y-0.5`}
        >
          <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            {item.char}
          </span>
        </div>
      ))}
    </div>
  );
}