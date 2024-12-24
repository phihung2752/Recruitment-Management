import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // This is a mock implementation. In a real application, you would validate the credentials against your database.
  if (email === 'admin@example.com' && password === 'password') {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'admin@example.com',
      role: 'admin' as const,
    }
    return NextResponse.json({ user })
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}

