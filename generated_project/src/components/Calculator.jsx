import React, { useState, useEffect } from "react";
import Button from "./Button";
import "../styles.css"; // Ensure global styles are applied

export default function Calculator() {
  // State variables
  const [current, setCurrent] = useState("0"); // Displayed value
  const [previous, setPrevious] = useState(""); // Stored previous operand
  const [operation, setOperation] = useState(null); // Current operator (+, -, *, /)
  const [overwrite, setOverwrite] = useState(false); // Flag to replace current on next digit input

  // Helper to perform calculation based on stored operation
  const compute = () => {
    if (!operation || previous === "") return current;
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    let result;
    switch (operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "/":
        if (curr === 0) return "Error";
        result = prev / curr;
        break;
      default:
        return current;
    }
    // Remove trailing .0 if integer
    const resStr = Number.isFinite(result) ? result.toString() : "Error";
    return resStr;
  };

  // Handlers
  const handleDigit = (digit) => {
    if (overwrite) {
      setCurrent(digit);
      setOverwrite(false);
      return;
    }
    if (current === "0") {
      // Avoid leading zeros
      if (digit === "0") return;
      setCurrent(digit);
    } else {
      setCurrent(current + digit);
    }
  };

  const handleDecimal = () => {
    if (overwrite) {
      setCurrent("0.");
      setOverwrite(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  };

  const handleOperator = (op) => {
    if (previous && operation) {
      // Compute intermediate result before chaining
      const result = compute();
      setPrevious(result);
      setCurrent(result);
    } else {
      setPrevious(current);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const handleEquals = () => {
    if (!operation) return;
    const result = compute();
    setCurrent(result);
    setPrevious("");
    setOperation(null);
    setOverwrite(true);
  };

  const handleClear = () => {
    setCurrent("0");
    setPrevious("");
    setOperation(null);
    setOverwrite(false);
  };

  const handleBackspace = () => {
    if (overwrite) {
      setCurrent("0");
      setOverwrite(false);
      return;
    }
    if (current.length > 1) {
      setCurrent(current.slice(0, -1));
    } else {
      setCurrent("0");
    }
  };

  // Keyboard support
  useEffect(() => {
    const keyHandler = (e) => {
      const { key } = e;
      if (key >= "0" && key <= "9") {
        e.preventDefault();
        handleDigit(key);
      } else if (key === ".") {
        e.preventDefault();
        handleDecimal();
      } else if (key === "+") {
        e.preventDefault();
        handleOperator("+");
      } else if (key === "-") {
        e.preventDefault();
        handleOperator("-");
      } else if (key === "*" || key === "x" || key === "X") {
        e.preventDefault();
        handleOperator("*");
      } else if (key === "/") {
        e.preventDefault();
        handleOperator("/");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (key === "Escape") {
        e.preventDefault();
        handleClear();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [current, previous, operation, overwrite]);

  // Render button grid
  const renderButton = (label, onClick, className = "") => (
    <Button
      key={label}
      label={label}
      onClick={onClick}
      className={className}
    />
  );

  return (
    <div className="calculator">
      <div className="display" data-testid="display">{current}</div>
      <div className="buttons">
        {renderButton("C", handleClear, "utility")}
        {renderButton("⌫", handleBackspace, "utility")}
        {renderButton("÷", () => handleOperator("/"), "operator")}
        {renderButton("7", () => handleDigit("7"))}
        {renderButton("8", () => handleDigit("8"))}
        {renderButton("9", () => handleDigit("9"))}
        {renderButton("×", () => handleOperator("*"), "operator")}
        {renderButton("4", () => handleDigit("4"))}
        {renderButton("5", () => handleDigit("5"))}
        {renderButton("6", () => handleDigit("6"))}
        {renderButton("-", () => handleOperator("-"), "operator")}
        {renderButton("1", () => handleDigit("1"))}
        {renderButton("2", () => handleDigit("2"))}
        {renderButton("3", () => handleDigit("3"))}
        {renderButton("+", () => handleOperator("+"), "operator")}
        {renderButton("0", () => handleDigit("0"), "" )}
        {renderButton(".", handleDecimal)}
        {renderButton("=", handleEquals, "operator")}
      </div>
    </div>
  );
}
