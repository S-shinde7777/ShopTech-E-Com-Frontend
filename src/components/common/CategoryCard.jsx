import React from "react";

const CategoryCard = ({ category, onClick, active = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        p-5
        cursor-pointer
        border
        transition
        duration-300
        flex
        flex-col
        items-center
        justify-between
        ${
          active
            ? "bg-[#F5A623]/10 border-[#F5A623] shadow-[0_0_15px_rgba(245,166,35,0.15)]"
            : "bg-[#171B26] border-gray-800 hover:border-[#F5A623] hover:-translate-y-1"
        }
      `}
    >
      {/* Icon/Image container */}
      <div
        className={`
          h-24
          w-full
          flex
          items-center
          justify-center
          rounded-xl
          mb-4
          transition-colors
          duration-300
          ${active ? "bg-[#F5A623]/10" : "bg-[#0F1117]"}
        `}
      >
        <img
          src={category.image}
          alt={category.name}
          className="h-14 w-14 object-contain filter brightness-95"
        />
      </div>

      {/* Name and items count */}
      <div className="text-center">
        <h3 className={`text-base font-bold transition ${active ? "text-[#F5A623]" : "text-white"}`}>
          {category.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {category.items} Products
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;
