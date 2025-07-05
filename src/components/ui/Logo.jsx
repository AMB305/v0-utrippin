import React from "react";

export default function Logo() {
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
    <div className="flex items-center space-x-1 animate-pulse-gradient">
      {letters.map((item, idx) => (
        <div
          key={idx}
          className={`${item.color} ${item.hover} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
          flex items-center justify-center rounded transition duration-300 
          hover:shadow-md hover:-translate-y-0.5`}
        >
          <span className="text-white font-bold text-xs sm:text-sm md:text-base">
            {item.char}
          </span>
        </div>
      ))}
    </div>
  );
}