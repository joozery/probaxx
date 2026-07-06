import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { cookies } from 'next/headers'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT ?? '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  if (!cookieStore.get('admin_session')?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'ต้องเป็นไฟล์รูปภาพเท่านั้น (เช่น .png, .jpg)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME ?? '',
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const url = `${process.env.R2_PUBLIC_URL}/${key}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
