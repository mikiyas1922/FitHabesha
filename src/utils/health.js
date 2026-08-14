export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null
  const weight = parseFloat(weightKg)
  const height = parseFloat(heightCm)
  if (!weight || !height) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}
