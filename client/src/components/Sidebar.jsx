import React, { useState } from "react"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BookmarkSquareIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  LogoIcon,
  UsersIcon,
} from "../assets/icons"

const SidebarData = [
  {
    icon: HomeIcon,
    name: "Dashboard",
    page: "/",
  },
  {
    icon: ClipboardDocumentListIcon,
    name: "Customer Orders",
    page: "/customerOrders",
  },
  {
    icon: UsersIcon,
    name: "Employees",
    page: "/employees",
  },
  {
    icon: BookmarkSquareIcon,
    name: "Inventory",
    page: "/inventory",
  },
  {
    icon: ChartBarSquareIcon,
    name: "Analytics",
    page: "/analytics",
  },
]

const Sidebar = () => {
  const [selected, setSelected] = useState(0)
  const [expanded, setExpanded] = useState(true)
  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  }

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <img src={Bars3Icon} alt="Bars 3 Icon" width={20} height={20} />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="logo">
          <img src={LogoIcon} alt="logo" />
          <span>
            Sh<span>o</span>ps
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <Link
              to={item.page}
              className={selected === index ? "menuItem active" : "menuItem"}
              onClick={() => {
                setSelected(index)
              }}
              key={index}
            >
              <img src={item.icon} alt={item.name} width={20} height={20} />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="menuItem">
            <img
              src={ArrowRightStartOnRectangleIcon}
              alt="Arrow Right Start on Rectangle Icon"
              width={20}
              height={20}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
