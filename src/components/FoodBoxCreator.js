import React, { useState, useEffect, useRef } from "react"
import {
  IconStar,
  IconStarFilled,
  IconLeaf,
  IconApple,
  IconMeat,
  IconMilk,
  IconGrain,
  IconFish,
  IconNut,
  IconTipJarEuro,
  IconBottle,
  IconPepper,
  IconEggs,
} from "@tabler/icons-react"
import { ingredients } from "../data/ingredients"
import {
  nutrientPowerhouseBox,
  heartHealthyBox,
  diabeticFriendlyBox,
  plantBasedVeganBox,
  mediterraneanCuisineBox,
  glutenFreeBox,
  kidFriendlyBox,
  seniorNutritionBox,
  culturallyDiverseBox,
  comfortFoodBox,
} from "../data/foodBoxes"
import greenApple from "../assets/green_apple.png"
import yellowPasta from "../assets/yellow_pasta.png"
import redDoughnut from "../assets/red_doughnut.png"

import "../App.css"

const categories = [
  { name: "favorites", icon: <IconStar /> },
  { name: "vegetables", icon: <IconLeaf /> },
  { name: "fruits", icon: <IconApple /> },
  { name: "meats", icon: <IconMeat /> },
  { name: "dairy", icon: <IconMilk /> },
  { name: "grains", icon: <IconGrain /> },
  { name: "seafoods", icon: <IconFish /> },
  { name: "legumes", icon: <IconEggs /> },
  { name: "nuts and seeds", icon: <IconNut /> },
  { name: "canned goods", icon: <IconTipJarEuro /> },
  { name: "spices and herbs", icon: <IconPepper /> },
  { name: "oils", icon: <IconBottle /> },
]

const foodBoxTemplates = {
  "Nutrient Powerhouse": nutrientPowerhouseBox,
  "Heart Healthy": heartHealthyBox,
  "Diabetic Friendly": diabeticFriendlyBox,
  "Plant-Based Vegan": plantBasedVeganBox,
  "Mediterranean Cuisine": mediterraneanCuisineBox,
  "Gluten-Free": glutenFreeBox,
  "Kid Friendly": kidFriendlyBox,
  "Senior Nutrition": seniorNutritionBox,
  "Culturally Diverse": culturallyDiverseBox,
  "Comfort Food": comfortFoodBox,
}

const generate5DigitCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const capitalizeFirstLetter = (string) => {
  if (!string) return ""
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

function FoodBoxCreator() {
  const [currentCategory, setCurrentCategory] = useState("vegetables")
  const [foodBoxItems, setFoodBoxItems] = useState([])
  const [generatedCode, setGeneratedCode] = useState(null)
  const [isBoxLocked, setIsBoxLocked] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [favorites, setFavorites] = useState([])
  const ingredientsListRef = useRef(null)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customTemplates, setCustomTemplates] = useState([])

  useEffect(() => {
    const fetchCustomTemplates = async () => {
      try {
        const response = await fetch(
          "https://flavr-413021.ue.r.appspot.com/customFoodBoxes"
        )
        const data = await response.json()
        setCustomTemplates(data)
      } catch (error) {
        console.error("Error fetching custom templates:", error)
      }
    }

    fetchCustomTemplates()
  }, [])

  const filteredItems =
    currentCategory === "favorites"
      ? ingredients.filter((item) => favorites.includes(item.name))
      : ingredients.filter((item) => item.category === currentCategory)

  const addToFoodBox = (ingredient) => {
    if (
      !isBoxLocked &&
      !foodBoxItems.some((food) => food.name === ingredient.name)
    ) {
      setFoodBoxItems((prevItems) => [...prevItems, ingredient])
    }
  }

  const removeFromFoodBox = (item) => {
    setFoodBoxItems((prevItems) =>
      prevItems.filter((food) => food.name !== item.name)
    )
  }

  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
    if (ingredientsListRef.current) {
      ingredientsListRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const toggleFavorite = (ingredient) => {
    if (favorites.includes(ingredient.name)) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav !== ingredient.name)
      )
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, ingredient.name])
    }
  }

  const getBackgroundColor = (swapColor) => {
    switch (swapColor) {
      case "green":
        return "#e7f8e7" // light green background
      case "yellow":
        return "#fffbe6" // light yellow background
      case "red":
        return "#ffe6e6" // light red background
      default:
        return "#fff" // white for unranked items
    }
  }

  const handleGenerateCode = () => {
    const code = generate5DigitCode()
    setGeneratedCode(code)
    setIsBoxLocked(true)
  }

  const handlePublishBox = async () => {
    try {
      const itemsToSend = foodBoxItems.map((item) => item.name)

      const response = await fetch(
        "https://flavr-413021.ue.r.appspot.com/foodBox",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: generatedCode,
            items: itemsToSend,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log("Food box published:", data)
        setIsPublished(true)
      } else {
        console.error("Error publishing food box:", await response.json())
      }
    } catch (error) {
      console.error("Error publishing food box:", error)
    }
  }

  const handleRefresh = () => {
    setFoodBoxItems([])
    setGeneratedCode(null)
    setIsBoxLocked(false)
    setIsPublished(false)
  }

  const handleTemplateSelection = (template) => {
    const selectedItems =
      foodBoxTemplates[template] ||
      customTemplates.find((t) => t.name === template)?.items ||
      []

    const fullIngredients = selectedItems
      .map((itemName) =>
        ingredients.find((ingredient) => ingredient.name === itemName)
      )
      .filter(Boolean)

    setFoodBoxItems(fullIngredients)
  }

  return (
    <div className="App-content">
      <div className="food-box">
        {/* Header and Buttons Section */}
        <div className="food-box-header-section sticky-header">
          <div className="food-box-header">
            <h2>Your Food Box ({foodBoxItems.length})</h2>
            <button className="refresh-button" onClick={handleRefresh}>
              &#x21bb;
            </button>
          </div>

          <div className="food-box-controls">
            {!generatedCode ? (
              <button
                className="generate-code-button"
                onClick={handleGenerateCode}
                disabled={foodBoxItems.length < 5}
              >
                Generate 5-Digit Code
              </button>
            ) : (
              <p className="generated-code">Your Code: {generatedCode}</p>
            )}

            {!isPublished ? (
              <button
                className="publish-box-button"
                onClick={handlePublishBox}
                disabled={!generatedCode}
              >
                Confirm and Publish
              </button>
            ) : (
              <p className="publish-confirmation">Success!</p>
            )}
          </div>
        </div>

        {/* Scrollable List Section */}
        <div className="food-box-list-section">
          <div className="food-box-list">
            {foodBoxItems.length === 0 ? (
              <div>
                <p>No items added yet</p>
                <select
                  className="custom-select"
                  onChange={(e) => handleTemplateSelection(e.target.value)}
                  value={selectedTemplate}
                >
                  <option value="" disabled>
                    Select a food box template
                  </option>
                  {Object.keys(foodBoxTemplates).map((template, index) => (
                    <option key={index} value={template}>
                      {template}
                    </option>
                  ))}
                  {customTemplates.map((template, index) => (
                    <option key={index} value={template.name}>
                      {template.name} (Custom)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <ul>
                {foodBoxItems.map((item, index) => (
                  <li
                    key={index}
                    className="food-box-item"
                    style={{
                      backgroundColor: getBackgroundColor(item.swapColor),
                    }} // Apply background color
                  >
                    <div className="food-box-item-content">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="food-box-item-icon"
                      />
                      <span>{capitalizeFirstLetter(item.name)}</span>
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => removeFromFoodBox(item)}
                    >
                      &#x2716;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="categories-container">
        <div className="sticky-list-header">
          <div className="food-box-header">
            <h2>Categories</h2>
          </div>
        </div>
        <div className="food-box-list-section">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-tab ${
                currentCategory === category.name ? "selected-tab" : ""
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.icon}
              <span>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ingredients-list" ref={ingredientsListRef}>
        <div className="sticky-list-header">
          <div className="food-box-header">
            <h2>Items</h2>
          </div>
        </div>

        <div className="food-box-list-section ingredient-grid">
          {filteredItems.length === 0 ? (
            <p>No items found for {currentCategory}</p>
          ) : (
            filteredItems.map((ingredient) => (
              <IngredientCard
                key={ingredient.item_id}
                ingredient={ingredient}
                addToFoodBox={addToFoodBox}
                isBoxLocked={isBoxLocked}
                isAdded={foodBoxItems.some(
                  (item) => item.name === ingredient.name
                )}
                toggleFavorite={() => toggleFavorite(ingredient)}
                isFavorite={favorites.includes(ingredient.name)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const IngredientCard = ({
  ingredient,
  addToFoodBox,
  isBoxLocked,
  isAdded,
  toggleFavorite,
  isFavorite,
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  // Function to select the correct SWAP icon based on swapColor
  const getSwapIcon = (swapColor) => {
    switch (swapColor) {
      case "green":
        return <img src={greenApple} alt="Green Apple" className="swap-icon" />
      case "yellow":
        return (
          <img src={yellowPasta} alt="Yellow Pasta" className="swap-icon" />
        )
      case "red":
        return (
          <img src={redDoughnut} alt="Red Doughnut" className="swap-icon" />
        )
      default:
        return null // Don't show anything for unranked
    }
  }

  return (
    <div className="ingredient-card">
      {/* Star button in the top-right corner */}
      <button className="favorite-button" onClick={toggleFavorite}>
        {isFavorite ? <IconStarFilled size={24} /> : <IconStar size={24} />}
      </button>

      <div className="ingredient-header">
        <img
          src={ingredient.img}
          alt={ingredient.name}
          className="ingredient-img"
        />
        <h2 className="ingredient-name">
          {capitalizeFirstLetter(ingredient.name)}
          {/* Display the SWAP icon next to the ingredient name */}
          {/* {getSwapIcon(ingredient.swapColor)} */}
        </h2>
      </div>

      {!isBoxLocked && (
        <div className="ingredient-actions">
          {!isAdded && (
            <button
              className="add-button"
              onClick={() => addToFoodBox(ingredient)}
            >
              Add to Box
            </button>
          )}
          {/* <button className="details-button" onClick={toggleDetails}>
            {showDetails ? (
              <>Less Details &#9650;</>
            ) : (
              <>More Details &#9660;</>
            )}
          </button> */}
        </div>
      )}

      {/* {showDetails && (
        <div className="ingredient-details">
          <div className="storage-tip">
            <h4>Fresh for:</h4>
            <p>{ingredient.exp_int} days</p>
          </div>
          <div className="storage-tip">
            <h4>Storage Info</h4>
            <p>{ingredient.storage_tip}</p>
          </div>
          <div className="health-facts">
            <h4>Health Info</h4>
            <p>{ingredient.whyEat}</p>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default FoodBoxCreator
