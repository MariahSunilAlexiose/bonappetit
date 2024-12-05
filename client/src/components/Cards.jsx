import React, { useEffect, useState } from "react"

import axios from "axios"
import { motion } from "framer-motion"
import PropTypes from "prop-types"

import {
  BusinessAndFinanceIcon,
  CurrencyDollarIcon,
  RateIcon,
} from "../assets/icons"

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

const Card = ({ title, color, value, png }) => {
  return (
    <motion.div
      className="flex flex-1 !h-28 text-white relative cursor-pointer p-4 rounded-xl !hover:shadow-none"
      style={{
        background: color.backGround,
        boxShadow: color.boxShadow,
      }}
    >
      <div className="flex flex-1">
        <div
          className={`self-center ${title === "Average Ratings" ? "" : "gap-1.5"}`}
        >
          {title === "Average Ratings" ? (
            <img src={png} alt={title} width={55} height={55} />
          ) : (
            <img src={png} alt={title} width={45} height={45} />
          )}
          <span
            className="text-xl font-bold"
            dangerouslySetInnerHTML={{ __html: title }}
          ></span>
        </div>
        <div className="detail flex-1 flex flex-col self-end text-right">
          <span className="text-2xl font-extrabold">
            {title === "Average Ratings" ? value : formatCurrency(value)}
          </span>
          <span className="font-medium text-md">
            {title === "Average Ratings" ? "" : "Last 24 hours"}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const Cards = () => {
  const [sales, setSales] = useState(0)
  const [profit, setProfit] = useState(0)
  const [ratings, setRatings] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sales = await axios.get("/total_sales")
        setSales(sales.data[0].total_sales)
        const profit = await axios.get("/total_profit")
        setProfit(profit.data[0].total_profit)
        const ratings = await axios.get("/avg_rating")
        setRatings(ratings.data[0].average_rating)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])
  const cardsData = [
    {
      title: "Sales",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      value: sales.toString(),
      png: CurrencyDollarIcon,
    },
    {
      title: "Profit",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      value: profit.toString(),
      png: BusinessAndFinanceIcon,
    },
    {
      title: "Average Ratings",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      value: ratings.toString(),
      png: RateIcon,
    },
  ]
  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
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
