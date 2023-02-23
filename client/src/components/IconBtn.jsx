import React from "react";

const IconBtn = ({ Icon, isActive, color, children, ...props }) => {
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${
        color || ""
      }`}
      {...props}
    >
      {/* just adds spacing next to button if there are children */}
      <span className={`${children !== null ? "mr-1" : ""}`}>
        <Icon />
      </span>
      {/* children is the number of likes in this case */}
      {children}
    </button>
  );
};

export default IconBtn;
