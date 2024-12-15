import React, { useState } from "react"

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

import {
  Bars3Icon,
  BoxesIcon,
  ClipboardDocumentListIcon,
  KnifeForkIcon,
  LogoIcon,
  UsersIcon,
  WorkerIcon,
} from "../assets/icons"

const SidebarData = [
  {
    icon: KnifeForkIcon,
    name: "Restaurants",
    page: "/restaurants",
  },
  {
    icon: UsersIcon,
    name: "Customers",
    page: "/customers",
  },
  {
    icon: WorkerIcon,
    name: "Employees",
    page: "/employees",
  },
  {
    icon: ClipboardDocumentListIcon,
    name: "Inventory",
    page: "/inventory",
  },
  {
    icon: BoxesIcon,
    name: "Suppliers",
    page: "/suppliers",
  },
]

const Sidebar = () => {
  const [selected, setSelected] = useState(-1)
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()
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
        <div className="ml-3 flex gap-2" onClick={() => navigate("/")}>
          <img src={LogoIcon} alt="logo" width={70} height={70} />
          <span className="text-2xl">Bon Appetit</span>
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
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
