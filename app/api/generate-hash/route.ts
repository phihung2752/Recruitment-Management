import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()
        
        console.log('🔍 Generating password hash for:', password);
        
        // Generate hash
        const hash = bcrypt.hashSync(password, 12);
        console.log('🔐 Generated hash:', hash);
        
        // Test verification
        const isValid = bcrypt.compareSync(password, hash);
        console.log('✅ Hash verification:', isValid);
        
        return NextResponse.json({ 
            success: true, 
            hash: hash,
            verified: isValid
        });
        
    } catch (error) {
        console.error('❌ Hash generation error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Hash generation failed',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

