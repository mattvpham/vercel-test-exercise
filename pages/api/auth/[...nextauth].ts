import NextAuth, { AuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
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

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    error?: string
    refreshToken?: string
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
  }
}

async function refreshAccessToken(token: JWT) {
  // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-refresh-token.html
  try {
    // InitiateAuth
    const url = "https://cognito-idp.us-east-1.amazonaws.com/"

    const response = await fetch(url, {
      headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: token.refreshToken,
        },
        ClientId: process.env.COGNITO_CLIENT_ID,
      }),
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: AuthOptions = {
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
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const expiresAt = account.expires_at ?? 600
        token.accessToken = account.access_token
        token.accessTokenExpires = Date.now() + expiresAt * 1000
        token.refreshToken = account.refresh_token
        token.user = user
        return token
      }

      // Return previous token if the access token has not expired yet
      const accessTokenExpires = token.accessTokenExpires ?? Date.now()
      if (Date.now() < accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
}

export default NextAuth(authOptions)
