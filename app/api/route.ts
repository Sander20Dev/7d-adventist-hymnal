import { NextResponse } from 'next/server'
import { hymns } from '../lib/hymns'

export async function GET() {
  return new NextResponse(JSON.stringify(hymns))
}
