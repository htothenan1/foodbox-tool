import React from "react"
import { Link } from "react-router-dom"
import foodbankapp from "../assets/soteria.png"
import "../App.css"

const Header = () => {
  return (
    <header className="App-header">
      <div className="header-content">
        <img src={foodbankapp} alt="QR Food Box" className="company-logo" />
        <p className="title">FeedLink</p>
      </div>
      <nav>
        <Link to="/food-box-creator" className="nav-link">
          Food Box Creator
        </Link>
        <Link to="/feedback" className="nav-link">
          Feedback
        </Link>
      </nav>
    </header>
  )
}

export default Header
