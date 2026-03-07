import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  isAdmin?: boolean
}

function getSessionOptions(): SessionOptions {
  const sessionSecret = process.env.SESSION_SECRET
  if (!sessionSecret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production')
  }
  return {
    cookieName: 'minibox-session',
    password: sessionSecret || 'dev-only-secret-change-in-production-min-32-chars',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
}

export const sessionOptions: SessionOptions = {
  cookieName: 'minibox-session',
  password: process.env.SESSION_SECRET || 'dev-only-secret-change-in-production-min-32-chars',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, getSessionOptions())
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session.isAdmin === true
}
