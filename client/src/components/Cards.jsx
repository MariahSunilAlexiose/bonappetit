import React, { useState } from "react"

import { motion } from "framer-motion"
import PropTypes from "prop-types"

import {
  BudgetIcon,
  BusinessAndFinanceIcon,
  CurrencyDollarIcon,
} from "../assets/icons"

const cardsData = [
  {
    title: "Sales",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: CurrencyDollarIcon,
  },
  {
    title: "Revenue",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "14,270",
    png: BusinessAndFinanceIcon,
  },
  {
    title: "Expenses",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: BudgetIcon,
  },
]

const Card = ({ title, color, value, png }) => {
  // eslint-disable-next-line
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      className="flex flex-1 !h-28 text-white relative cursor-pointer p-4 rounded-xl !hover:shadow-none"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
    >
      <div className="flex flex-1">
        <div className="self-start">
          <img src={png} alt={title} width={40} height={40} />
          <span className="text-[17px] font-bold">{title}</span>
        </div>
        <div className="detail flex-1 flex flex-col self-end text-right">
          <span className="text-2xl font-extrabold">${value}</span>
          <span className="font-medium text-md">Last 24 hours</span>
        </div>
      </div>
    </motion.div>
  )
}

const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
            />
          </div>
        )
      })}
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.shape({
    backGround: PropTypes.string.isRequired,
    boxShadow: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
  png: PropTypes.elementType.isRequired,
}

export default Cards
