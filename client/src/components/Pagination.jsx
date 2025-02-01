import React from "react"
import { Link } from "react-router-dom"

import PropTypes from "prop-types"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "../assets/icons"

const PaginationItem = React.forwardRef(function PaginationItem(
  { className, ...props },
  ref
) {
  return <li ref={ref} className={className} {...props} />
})

PaginationItem.propTypes = { className: PropTypes.string }

const PaginationLink = ({ isActive, ...props }) => (
  <Link
    className={"h-5 w-9 cursor-pointer px-2 py-0"}
    aria-current={isActive ? "page" : undefined}
    {...props}
  />
)

PaginationLink.propTypes = {
  isActive: PropTypes.bool,
}

const PaginationEllipsis = ({ ...props }) => (
  <span
    aria-hidden
    className="flex h-9 w-9 items-center justify-center"
    {...props}
  >
    <img
      src={EllipsisHorizontalIcon}
      alt="Ellipsis Horizontal Icon"
      className="h-4 w-4"
    />
    <span className="sr-only">More pages</span>
  </span>
)

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  if (totalItems <= itemsPerPage) {
    return null
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const maxPageNum = 5 // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2) // Current page should be in the middle if possible

  let activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
  )

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          currentPage === page
            ? "rounded border border-[#2563eb] bg-transparent shadow-sm hover:bg-blue-200"
            : "rounded hover:bg-blue-200"
        }
      >
        <PaginationLink href="#" onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ))

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />
      )
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />
      )
    }

    return renderedPages
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex flex-row items-center gap-1">
        <PaginationItem>
          <PaginationLink
            aria-label="Go to previous page"
            className="flex rounded p-1 shadow-sm hover:bg-blue-200"
            href="#"
            onClick={handlePrevPage}
          >
            <img
              src={ChevronLeftIcon}
              alt="Chevron Left Icon"
              className="h-4 w-4"
            />
          </PaginationLink>
        </PaginationItem>
        {renderPages()}
        <PaginationItem className="px-2.5">
          <PaginationLink
            aria-label="Go to next page"
            className="flex rounded p-1 shadow-sm hover:bg-blue-200"
            href="#"
            onClick={handleNextPage}
          >
            <img
              src={ChevronRightIcon}
              alt="Chevron Right Icon"
              className="h-4 w-4"
            />
          </PaginationLink>
        </PaginationItem>
      </ul>
    </nav>
  )
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
}

export default Pagination
