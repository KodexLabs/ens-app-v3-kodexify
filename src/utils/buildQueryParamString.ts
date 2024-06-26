export const buildQueryParamString = (params: Record<string, any>) => {
  const formattedParams: Record<string, string> = {}

  Object.entries(params).map(([key, value]) => {
    formattedParams[key] = String(value)
    return value
  })

  const urlParamsObject = new URLSearchParams(formattedParams)
  return urlParamsObject.toString()
}
