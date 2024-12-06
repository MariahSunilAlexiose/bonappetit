import React, { useState } from "react"

import PropTypes from "prop-types"

const InputDropDown = ({ options, onChange, label }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
        <div className="flex items-center border-b px-3">
          <input
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
            value={searchTerm}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search option..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          {open && options && (
            <div className="overflow-hidden p-1">
              {options.filter((option) =>
                option.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > 0 ? (
                options
                  .filter((option) =>
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((option, index) => (
                    <div
                      key={index}
                      className="hover:bg-accent/40 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => {
                        setSearchTerm(option.name)
                        setOpen(false)
                        label === "restaurants"
                          ? onChange(option.restaurantID)
                          : onChange(option.supplierID)
                      }}
                    >
                      {option.name}
                    </div>
                  ))
              ) : (
                <div className="py-6 text-center text-sm">No option found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

InputDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      restaurantID: PropTypes.number,
      supplierID: PropTypes.number,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}

export default InputDropDown
