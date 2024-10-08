import React, { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useNavigate } from "react-router-dom"
import "../FoodBoxDisplay.css" // Import the updated CSS file

const FoodBoxDisplay = ({ foodBoxCode }) => {
  const [foodBoxData, setFoodBoxData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setFoodBoxData(null)
    setError(null)
  }, [foodBoxCode])

  useEffect(() => {
    const fetchFoodBoxData = async () => {
      if (!foodBoxCode) {
        return
      }
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

        const feedbackResponse = await fetch(
          `https://flavr-413021.ue.r.appspot.com/foodBox/${foodBoxCode}/feedback`
        )
        const feedbackData = feedbackResponse.ok
          ? await feedbackResponse.json()
          : { consumedItems: [], wastedItems: [] }

        setFoodBoxData({
          ...foodBoxData,
          consumedItems: feedbackData.consumedItems,
          wastedItems: feedbackData.wastedItems,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoodBoxData()
  }, [foodBoxCode])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const handleQrCodeClick = () => {
    navigate(`/print/${foodBoxCode}`)
  }

  const handleReceiptClick = () => {
    navigate(`/receipt/${foodBoxCode}`)
  }

  const saveAsTemplate = async () => {
    const templateName = window.prompt("Enter a name for the template:")
    if (!templateName) {
      alert("Template name is required!")
      return
    }

    try {
      if (
        !foodBoxData ||
        !foodBoxData.items ||
        foodBoxData.items.length === 0
      ) {
        alert("There are no items to save as a template!")
        return
      }

      const response = await fetch(
        "https://flavr-413021.ue.r.appspot.com/customFoodBox",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: templateName,
            items: foodBoxData.items,
            originalFoodBoxId: foodBoxCode,
          }),
        }
      )

      if (response.ok) {
        alert("Template saved successfully!")
      } else {
        alert("Error saving template")
      }
    } catch (error) {
      console.error("Error saving template:", error)
    }
  }

  return (
    <div className="food-box-display">
      <div className="header-with-button">
        <div>
          <h2 className="section-title">Food Box ID: {foodBoxCode}</h2>
          {foodBoxData && (
            <p>
              Date Created:{" "}
              {new Date(foodBoxData.dateCreated).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="button-and-qr-container">
          <button
            className="generate-receipt-button"
            onClick={handleReceiptClick}
          >
            Customer Receipt
          </button>
          <button className="generate-qr-button" onClick={handleQrCodeClick}>
            Food Box Codes
          </button>
          <button className="save-template-button" onClick={saveAsTemplate}>
            Save as Template
          </button>
        </div>
      </div>

      {isLoading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {foodBoxData && (
        <div className="food-box-data-grid">
          <div className="food-box-section">
            <h3>Items</h3>
            <ul className="items-list">
              {foodBoxData.items.length > 0 ? (
                foodBoxData.items.map((item, index) => (
                  <li key={index}>{capitalizeFirstLetter(item)}</li>
                ))
              ) : (
                <p>No items in this food box</p>
              )}
            </ul>
          </div>

          <div className="food-box-section">
            <h3>Positives</h3>
            <ul className="items-list">
              {foodBoxData.consumedItems.length > 0 ? (
                foodBoxData.consumedItems.map((item, index) => (
                  <li key={index}>
                    <div>{capitalizeFirstLetter(item.name)}</div>
                    <div className="item-date">
                      Logged on:{" "}
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </div>
                  </li>
                ))
              ) : (
                <p>No positive reviews yet</p>
              )}
            </ul>
          </div>

          <div className="food-box-section">
            <h3>Negatives</h3>
            <ul className="items-list">
              {foodBoxData.wastedItems.length > 0 ? (
                foodBoxData.wastedItems.map((item, index) => (
                  <li key={index}>
                    <div>{capitalizeFirstLetter(item.name)}</div>
                    <div className="item-date">
                      Date Logged:{" "}
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </div>
                    {item.reason && (
                      <div className="reason">
                        <strong>Reason:</strong>{" "}
                        {capitalizeFirstLetter(item.reason)}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p>No negative reviews yet</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodBoxDisplay
