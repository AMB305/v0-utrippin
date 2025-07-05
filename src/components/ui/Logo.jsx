import React from "react";

export default function Logo() {
  const letters = [
    { char: "U", color: "bg-[#0068EF]" },
    { char: "T", color: "bg-[#005FCF]" },
    { char: "R", color: "bg-[#004FB0]" },
    { char: "I", color: "bg-[#004092]" },
    { char: "P", color: "bg-[#003073]" },
    { char: "P", color: "bg-[#002155]" },
    { char: "I", color: "bg-[#001137]" },
    { char: "N", color: "bg-[#000218]" },
  ];

  return (
    <div className="flex items-center space-x-1 animate-pulse-gradient">
      {letters.map((item, idx) => (
        <div
          key={idx}
          className={`${item.color} w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
          flex items-center justify-center rounded transition duration-300 
          hover:brightness-125 hover:shadow-md hover:-translate-y-0.5`}
        >
          <span className="text-white font-bold text-sm sm:text-base md:text-lg">
            {item.char}
          </span>
        </div>
      ))}
    </div>
  );
}