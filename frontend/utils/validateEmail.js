export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.com$/
  return regex.test(email)
}
