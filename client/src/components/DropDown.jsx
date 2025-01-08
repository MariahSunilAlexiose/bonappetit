import React, { useState } from "react"

import PropTypes from "prop-types"

import { ChevronUpDownIcon } from "../assets/icons"

const DropDown = ({
  options,
  onChange,
  defaultValue = "Select an option...",
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
        <div className="flex items-center border-b px-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex h-10 w-full items-center cursor-pointer rounded-md py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {value}
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
              {options.map((option, index) => (
                <div
                  key={index}
                  className="hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => {
                    setOpen(false)
                    onChange(option)
                    setValue(option)
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

DropDown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}

export default DropDown
