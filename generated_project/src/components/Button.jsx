import React from "react";
import PropTypes from "prop-types";
import "./styles.css";

export default function Button({ label, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      className={`calc-button ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
};
