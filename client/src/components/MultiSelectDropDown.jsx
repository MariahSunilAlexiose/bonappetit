import React, { useState } from "react"

import PropTypes from "prop-types"

import { ChevronUpDownIcon } from "../assets/icons"

const MultiSelectDropDown = ({ options, onChange }) => {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState([])

  const handleSelection = (option) => {
    const newSelectedValues = selectedValues.includes(option.inventoryID)
      ? selectedValues.filter((item) => item !== option.inventoryID)
      : [...selectedValues, option.inventoryID]

    setSelectedValues(newSelectedValues)
    onChange(newSelectedValues)
  }

  return (
    <div className="rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
        <div className="flex items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex h-10 w-full items-center cursor-pointer rounded-md py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedValues.length > 0
              ? selectedValues
                  .map(
                    (id) =>
                      options.find((option) => option.inventoryID === id).name
                  )
                  .join(", ")
              : "Select options"}
            <img
              src={ChevronUpDownIcon}
              alt="Chevron Up Down Icon"
              width={20}
              height={20}
              className="ml-auto"
            />
          </div>
        </div>
        {open && (
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <div className="overflow-hidden p-1">
              {options.map((option) => (
                <div
                  key={option.inventoryID}
                  className={`hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50 ${
                    selectedValues.includes(option.inventoryID)
                      ? "bg-accent/40"
                      : ""
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  {option.name}
                  {selectedValues.includes(option.inventoryID) && (
                    <span className="ml-auto">✔️</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

MultiSelectDropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MultiSelectDropDown
