import PremiumPriceOracle from './premiumPriceOracle'

export const getPremiumPrice = (expiryDate: number, timestamp: number) => {
  const oracle = new PremiumPriceOracle(expiryDate)

  const premiumPrice = oracle.getAmountByDateRange(timestamp)
  return premiumPrice
}
