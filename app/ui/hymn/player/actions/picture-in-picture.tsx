import { useEffect, useState } from 'react'
import { Button } from './button'
import {
  IconPictureInPictureOff,
  IconPictureInPictureOn,
} from '@tabler/icons-react'
import { createRoot } from 'react-dom/client'
import PipApp from './pip/app'
import { Hymn, Lyric } from '@/app/lib/types'
import clsx from 'clsx'

interface DocumentPictureInPicture {
  requestWindow(options: {
    width?: number
    height?: number
  }): Promise<DocumentPictureInPictureWindow>
  window?: DocumentPictureInPictureWindow
}

interface DocumentPictureInPictureWindow {
  window: Window & typeof globalThis
  document: Document
  addEventListener(ev: string, cb: () => void): void
  close(): void
}

declare const window: Window &
  typeof globalThis & { documentPictureInPicture?: DocumentPictureInPicture }

export default function PictureInPicture({
  audio,
  hymn,
  lyrics,
}: {
  audio: HTMLAudioElement
  hymn: Hymn
  lyrics: Lyric[]
}) {
  const [documentPictureInPicture, setDoc] = useState<
    DocumentPictureInPicture | undefined
  >(undefined)
  const [isPP, setIsPP] = useState(false)

  useEffect(() => {
    setDoc(window.documentPictureInPicture)
  }, [])

  if (documentPictureInPicture == null || audio == null) return <></>

  const handlePP = async () => {
    if (documentPictureInPicture.window) {
      documentPictureInPicture.window.close()
      setIsPP(false)
      return
    }

    const w = await documentPictureInPicture.requestWindow({
      width: 270,
      height: 180,
    })
    Array.from(document.styleSheets).forEach((styleSheet) => {
      try {
        const cssRules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('')
        const style = document.createElement('style')

        style.textContent = cssRules
        w.document.head.appendChild(style)
      } catch (e) {
        const link = document.createElement('link')

        link.rel = 'stylesheet'
        link.type = styleSheet.type
        link.media = styleSheet.media.toString()
        if (styleSheet.href) {
          link.href = styleSheet.href.toString()
        }
        w.document.head.appendChild(link)
      }
    })

    const rt = document.createElement('div')
    rt.id = 'root'
    w.document.body.appendChild(rt)
    createRoot(rt).render(<PipApp audio={audio} hymn={hymn} lyrics={lyrics} />)
    setIsPP(true)
    w.addEventListener('pagehide', () => {
      setIsPP(false)
    })
  }

  return (
    <>
      <Button
        label='Imagen en Imagen'
        onClick={handlePP}
        className={clsx('ml-2', { 'scale-110': isPP })}>
        {isPP ? <IconPictureInPictureOff /> : <IconPictureInPictureOn />}
      </Button>
    </>
  )
}
