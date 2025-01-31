import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { motion } from "framer-motion"

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
        className={`lg:hidden ${expanded ? "left-60" : "left-5"} z-9 fixed top-8 flex cursor-pointer rounded-lg bg-[#ffe0e0] p-2.5`}
        onClick={() => setExpanded(!expanded)}
      >
        <img src={Bars3Icon} alt="Bars 3 Icon" width={20} height={20} />
      </div>
      <motion.div
        className="relative flex flex-col pt-16 transition-all duration-300"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div
          className="ml-3 flex cursor-pointer gap-2"
          onClick={() => navigate("/")}
        >
          <img src={LogoIcon} alt="logo" width={70} height={70} />
          <span className="text-2xl font-bold">Bon Appetit</span>
        </div>

        <div className="ml-3 mt-16 flex flex-col gap-8">
          {SidebarData.map((item, index) => (
            <Link
              to={item.page}
              className={`flex h-10 items-center gap-4 rounded-lg text-sm transition-all duration-300 ${
                selected === index ? "bg-activeItem pl-1" : ""
              }`}
              onClick={() => setSelected(index)}
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
