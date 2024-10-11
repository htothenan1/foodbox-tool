import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./App.css"
import Feedback from "./components/Feedback"
import FoodBoxCreator from "./components/FoodBoxCreator"
import PrintPage from "./components/PrintPage"
import FoodBoxDisplay from "./components/FoodBoxDisplay"
import Header from "./components/Header"
import ReceiptPrintPage from "./components/ReceiptPrintPage"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/food-box-creator" element={<FoodBoxCreator />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* <Route path="/" element={<FoodBoxCreator />} /> */}
          <Route path="/print/:foodBoxCode" element={<PrintPage />} />
          <Route path="/receipt/:foodBoxCode" element={<ReceiptPrintPage />} />
          <Route path="/" element={<FoodBoxCreator />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
