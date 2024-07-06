export const calculateRegistrationPrice = (name: string) => {
  const usdPrice = { 7: 640, 8: 160 }[name.length] ?? 5
  const ethPrice = usdPrice / 1800

  return {
    usd: usdPrice,
    eth: ethPrice,
  }
}
