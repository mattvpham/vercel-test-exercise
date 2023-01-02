import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

const clientId = process.env.COGNITO_CLIENT_ID
const clientSecret = process.env.COGNITO_CLIENT_SECRET
const issuer = process.env.COGNITO_ISSUER

if (!clientId) {
  throw new Error("Missing COGNITO_CLIENT_ID")
}
if (!clientSecret) {
  throw new Error("Missing COGNITO_CLIENT_SECRET")
}
if (!issuer) {
  throw new Error("Missing COGNITO_ISSUER")
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CognitoProvider({
      clientId,
      clientSecret,
      issuer,
      idToken: true,
      checks: ["nonce", "pkce"],
    }),
  ],
}

export default NextAuth(authOptions)
