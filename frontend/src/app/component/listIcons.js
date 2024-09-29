"use client";
import Link from "next/link";
import { useState } from "react";
import RenerateRoute from "../components/regenerateRoute"; // Ensure correct import

const IconLinks = () => {
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);

  const links = [
    {
      href: "/awardboard",
      icon: "/images/other/award.png",
      alt: "Award Board",
    },
    {
      href: "/leadboard",
      icon: "/images/other/leadboard.png",
      alt: "Lead Board",
    },
    {
      href: "/",
      icon: "/images/other/regenerate.png",
      alt: "Regenerate",
      isRegenerate: true,
    },
    { href: "/", icon: "/images/other/add.png", alt: "Add" },
    { href: "/", icon: "/images/other/Trash.png", alt: "Trash" },
  ];

  return (
    <div className="flex flex-col space-y-4 items-center">
      {links.map((link, index) => (
        <div key={index} className="relative group">
          {link.isRegenerate ? (
            // For regenerate button, open the popup on click
            <button
              onClick={() => setIsRegenerateOpen(true)}
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src={link.icon} alt={link.alt} />
            </button>
          ) : (
            // Normal links
            <Link href={link.href}>
              <div className="hover:scale-110 transition-transform duration-200">
                <img src={link.icon} alt={link.alt} />
              </div>
            </Link>
          )}
          {/* Tooltip */}
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 text-white text-sm py-1 px-2 rounded shadow-lg">
            {link.alt}
          </span>
        </div>
      ))}

      {/* Regenerate Popup */}
      <RenerateRoute
        isOpen={isRegenerateOpen}
        onClose={() => setIsRegenerateOpen(false)}
      />
    </div>
  );
};

export default IconLinks;
