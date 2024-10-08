import React, { useState, useEffect } from "react"
import FoodBoxDisplay from "./FoodBoxDisplay"
import "../Feedback.css" // Import separate Feedback-specific CSS

function Feedback() {
  const [foodBoxCode, setFoodBoxCode] = useState("") // For tracking the selected food box code
  const [foodBoxList, setFoodBoxList] = useState([]) // For storing the list of all food box codes
  const [error, setError] = useState(null) // For handling errors
  const [isLoading, setIsLoading] = useState(false) // For tracking loading state

  // Fetch all food boxes from the backend when the component mounts
  useEffect(() => {
    const fetchFoodBoxList = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          "https://flavr-413021.ue.r.appspot.com/foodBoxes"
        )
        const data = await response.json()
        setFoodBoxList(data)
        setFoodBoxCode(data[0].code)
        setError(null)
      } catch (error) {
        setError("Error fetching food box list")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoodBoxList()
  }, [])

  return (
    <div className="feedback-content">
      {/* Left section: Food Box IDs (styled like category tabs) */}
      <div className="feedback-categories-container">
        <h3>Published IDs</h3>
        {isLoading ? (
          <p>Loading IDs...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="foodbox-list">
            {foodBoxList.map((foodBox, index) => (
              <li
                key={index}
                onClick={() => setFoodBoxCode(foodBox.code)}
                className={`foodbox-item ${
                  foodBoxCode === foodBox.code ? "selected" : ""
                }`}
              >
                {foodBox.code}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right section: Feedback display */}
      <div className="feedback-box-logs">
        {foodBoxCode ? (
          <FoodBoxDisplay foodBoxCode={foodBoxCode} />
        ) : (
          <p>Select a food box to see the feedback</p>
        )}
      </div>
    </div>
  )
}

export default Feedback
