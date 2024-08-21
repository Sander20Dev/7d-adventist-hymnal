import { NextResponse } from 'next/server'

const hymns: number[] = []

export async function POST(req: Request) {
  const hymn = await req.json()

  if (hymn == null) {
    return new NextResponse("{msg: 'It is not defined'}", { status: 400 })
  }
  if (hymn.hymnNumber == null) {
    return new NextResponse("{msg: 'hymnNumber property is not exists'}", {
      status: 400,
    })
  }
  if (typeof hymn.hymnNumber !== 'number') {
    return new NextResponse("{msg: 'hymnNumber property is not number'}", {
      status: 400,
    })
  }
  if (hymn.hymnNumber < 1 || hymn.hymnNumber > 613) {
    return new NextResponse("{msg: 'hymnNumber is not a hymn number'}", {
      status: 400,
    })
  }

  if (!hymns.includes(hymn.hymnNumber)) {
    console.log('Hymn Step Time Request -->', hymn.hymnNumber)
    hymns.push(hymn.hymnNumber)
  }

  return new NextResponse(
    `{msg: 'Hymn Step Time Request --> ${hymn.hymnNumber}'}`,
    { status: 200 }
  )
}

export async function GET() {
  return new NextResponse(JSON.stringify(hymns))
}
