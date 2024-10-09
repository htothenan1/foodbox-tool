import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { useParams, useNavigate } from "react-router-dom"
import "../PrintPage.css" // Separate CSS file for print page styling

const PrintPage = () => {
  const { foodBoxCode } = useParams() // Get the foodBoxCode from URL params
  const navigate = useNavigate()

  // Function to handle manual printing
  const handlePrint = () => {
    window.print()
  }

  // Function to navigate back to the FoodBoxDisplay
  const handleBack = () => {
    navigate(-1) // Go back to the previous page
  }

  return (
    <div className="print-page">
      <div className="cta-buttons">
        <button onClick={handleBack} className="back-button">
          Back to Food Box Display
        </button>
        <button onClick={handlePrint} className="print-button">
          Print QR Codes
        </button>
      </div>

      <div className="qr-code-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="qr-code-print-item">
            <p>{foodBoxCode}</p> {/* Print the 5-digit code above QR code */}
            <QRCodeSVG value={foodBoxCode} size={90} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PrintPage
