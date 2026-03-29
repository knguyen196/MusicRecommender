import React from 'react'
import { motion } from 'framer-motion'

export function WeightSlider({ weight, setWeight }) {
  
  const handleChange = (e) => {
    setWeight(parseInt(e.target.value))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="weight-slider-container"
    >
      <h3 className="slider-title">Recommendation Balance</h3>
      <p className="slider-description">
        Adjust how recommendations are generated
      </p>
      
      <div className="slider-wrapper">
        <div className="slider-labels">
          <span className="label-left">Collaborative</span>
          <span className="label-right">Content-Based</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={weight}
          onChange={handleChange}
          className="slider"
        />
        
        <div className="slider-value">
         <span>{100 - weight}% Collaborative</span>
         <span>{weight}% Content-Based</span>
        </div>
      </div>
    </motion.div>
  )
}