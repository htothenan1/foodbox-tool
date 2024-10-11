import React, { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useParams, useNavigate } from "react-router-dom"
import "../ReceiptPrintPage.css" // Add custom CSS for receipt printing
import FeedLinkLogo from "../assets/soteria.png" // Assuming you have a logo in this path

const ReceiptPrintPage = () => {
  const { foodBoxCode } = useParams() // Get the foodBoxCode from URL params
  const [foodBoxData, setFoodBoxData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  useEffect(() => {
    const fetchFoodBoxData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const foodBoxResponse = await fetch(
          `https://flavr-413021.ue.r.appspot.com/foodBox/${foodBoxCode}`
        )
        if (!foodBoxResponse.ok) {
          throw new Error("Food box not found")
        }

        const foodBoxData = await foodBoxResponse.json()
        setFoodBoxData(foodBoxData)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoodBoxData()
  }, [foodBoxCode])

  // Function to handle manual printing
  const handlePrint = () => {
    window.print()
  }

  // Function to navigate back to the FoodBoxDisplay
  const handleBack = () => {
    navigate(-1) // Go back to the previous page
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!foodBoxData) return <p>No food box data available.</p>

  return (
    <div className="print-page">
      <div className="cta-buttons">
        <button onClick={handleBack} className="back-button">
          Go Back
        </button>
        <button onClick={handlePrint} className="print-button">
          Print Receipt
        </button>
      </div>

      {/* Add the FeedLink title and logo inside the receipt */}
      <div className="receipt">
        <div className="receipt-header">
          <img
            src={FeedLinkLogo}
            alt="FeedLink Logo"
            className="company-logo"
          />
          <h1 className="receipt-title">FeedLink</h1>
        </div>

        <ul className="receipt-items">
          {foodBoxData.items && foodBoxData.items.length > 0 ? (
            foodBoxData.items.map((item, index) => (
              <li key={index}>{capitalizeFirstLetter(item)}</li>
            ))
          ) : (
            <li>No items in this food box</li>
          )}
        </ul>

        <p>Total Items: {foodBoxData.items.length}</p>

        <div className="qr-code-receipt">
          <h3>{foodBoxCode}</h3>
          <QRCodeSVG value={foodBoxCode} size={80} />
          <p>Visit FeedLink.app for more info</p>
        </div>
      </div>
    </div>
  )
}

export default ReceiptPrintPage
