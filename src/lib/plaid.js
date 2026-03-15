import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
})

export const plaidClient = new PlaidApi(configuration)
// Same idea as Prisma — one Plaid client your whole app shares. It reads your keys from .env and configures the connection to Plaid's sandbox.