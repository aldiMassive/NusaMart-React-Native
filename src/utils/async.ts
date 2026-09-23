export const withLatency = async <T>(
  value: T,
  minimum = 300,
  maximum = 800
): Promise<T> => {
  const duration = minimum + Math.floor(Math.random() * (maximum - minimum + 1))
  await new Promise(resolve => setTimeout(resolve, duration))
  return value
}
