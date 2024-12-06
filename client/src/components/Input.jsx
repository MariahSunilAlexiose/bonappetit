import React from "react"

import PropTypes from "prop-types"

const Input = ({
  name,
  type,
  value,
  onChange,
  placeholder = "",
  step,
  min,
  max,
  pattern,
}) => {
  return (
    <input
      name={name}
      type={type}
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={onChange}
      placeholder={placeholder}
      pattern={pattern}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      required
    />
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "number", "email", "tel", "password"])
    .isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string,
}

export default Input
