import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, executeSingle } from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  status: string
  roles: string[]
  permissions: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token
export function generateToken(user: User): string {
  return (jwt.sign as any)(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      roles: user.roles 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Get user by username or email
export async function getUserByCredentials(username: string): Promise<User | null> {
  try {
    const user = await executeSingle(`
      SELECT u.*, 
             STRING_AGG(DISTINCT r."RoleName", ',') as roles, 
             STRING_AGG(DISTINCT p."PermissionName", ',') as permissions
      FROM "Users" u
      LEFT JOIN "RolePermissions" rp ON u."RoleId" = rp."RoleId"
      LEFT JOIN "Roles" r ON rp."RoleId" = r."RoleId"
      LEFT JOIN "Permissions" p ON rp."PermissionId" = p."PermissionId"
      WHERE (u."Username" = $1 OR u."Email" = $2) AND u."Status" = 'Active'
      GROUP BY u."UserId"
    `, [username, username])

    if (!user) return null

    return {
      id: user.UserId,
      username: user.Username,
      email: user.Email,
      firstName: user.FirstName,
      lastName: user.LastName,
      status: user.Status,
      roles: user.roles ? [...new Set(user.roles.split(','))] as string[] : [],
      permissions: user.permissions ? [...new Set(user.permissions.split(','))] as string[] : []
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// Login user
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    console.log('🔍 Login attempt for:', credentials.username)
    
    const user = await getUserByCredentials(credentials.username)
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }

    // Get user with password hash
    const userWithPassword = await executeSingle(`
      SELECT "PasswordHash" FROM "Users" WHERE "UserId" = $1
    `, [user.id])

    console.log('🔐 Password hash found:', userWithPassword ? 'Yes' : 'No')
    console.log('🔐 Password hash:', userWithPassword?.PasswordHash)

    if (!userWithPassword) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    const isValidPassword = await verifyPassword(credentials.password, userWithPassword.PasswordHash)
    console.log('✅ Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }

    const token = generateToken(user)
    console.log('🎫 Token generated:', token ? 'Yes' : 'No')

    return {
      success: true,
      user,
      token
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Login failed'
    }
  }
}

// Check permission
export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission) || user.roles.includes('Admin')
}

// Check role
export function hasRole(user: User, role: string): boolean {
  return user.roles.includes(role) || user.roles.includes('Admin')
}

// Middleware for API routes - Direct function version
export async function requireAuth(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { success: false, message: 'No token provided' }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return { success: false, message: 'Invalid token' }
    }

    const user = await getUserByCredentials(decoded.username)
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    // Add user to request object
    (request as any).user = user
    return { success: true, user }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { success: false, message: 'Authentication error' }
  }
}

// Permission middleware - Direct function version
export async function requirePermission(request: NextRequest, permission: string) {
  const user = (request as any).user
  if (!user) {
    return { success: false, message: 'Authentication required' }
  }

  if (!hasPermission(user, permission)) {
    return { success: false, message: 'Insufficient permissions' }
  }

  return { success: true }
}

// Higher-order function middleware for API routes (legacy support)
export function requireAuthHOC(handler: any) {
  return async (request: NextRequest) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
      }

      const user = await getUserByCredentials(decoded.username)
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 })
      }

      // Add user to request object
      (request as any).user = user
      return handler(request)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json({ success: false, message: 'Authentication error' }, { status: 500 })
    }
  }
}

// Higher-order function permission middleware (legacy support)
export function requirePermissionHOC(permission: string) {
  return (handler: any) => {
    return async (request: NextRequest) => {
      const user = (request as any).user
      if (!user) {
        return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
      }

      if (!hasPermission(user, permission)) {
        return NextResponse.json({ success: false, message: 'Insufficient permissions' }, { status: 403 })
      }

      return handler(request)
    }
  }
}