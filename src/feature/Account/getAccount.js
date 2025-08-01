const Account = require("../../models/Account")
const User = require("../../models/User")
const userRepository = require("../../infra/mongoose/repository/userRepository")

const getAccount = async ({
  filter, repository
}) => {
  const result = await repository.get(filter)
  
  if (!result || result.length === 0) {
    return result
  }

  // Fetch user information for each account
  const accountsWithUserInfo = await Promise.all(
    result.map(async (accountData) => {
      const account = new Account(accountData)
      
      // Fetch user data using userId from account
      const userData = await userRepository.get({ _id: account.userId })
      
      if (userData && userData.length > 0) {
        const user = new User(userData[0])
        // Add user information to account
        return {
          ...account,
          username: user.username,
          email: user.email,
          password: user.password
        }
      }
      
      return account
    })
  )
  
  return accountsWithUserInfo
}

module.exports = getAccount