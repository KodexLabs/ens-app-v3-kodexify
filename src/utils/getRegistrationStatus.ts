const DAY_IN_SECONDS = 86400

export const getRegistrationStatus = (expireTime: number | null) => {
  if (!expireTime) return

  const now = new Date().getTime() / 1000
  const timeSinceExpiry = now - expireTime

  if (timeSinceExpiry < 0) return 'registered'

  if (timeSinceExpiry < DAY_IN_SECONDS * 90) return 'gracePeriod'

  if (timeSinceExpiry >= DAY_IN_SECONDS * 90 && timeSinceExpiry < DAY_IN_SECONDS * 111)
    return 'premium'

  if (timeSinceExpiry > DAY_IN_SECONDS * 111) return 'unregistered'
}
