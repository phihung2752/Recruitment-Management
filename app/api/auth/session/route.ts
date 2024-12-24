import { NextResponse } from 'next/server'

export async function GET() {
  // This is a mock implementation. In a real application, you would check the session from your backend or a cookie.
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
  }

  // Simulate a 50% chance of the user being logged in
  const isLoggedIn = Math.random() < 0.5

  if (isLoggedIn) {
    return NextResponse.json({ user: mockUser })
  } else {
    return NextResponse.json({ user: null })
  }
}

