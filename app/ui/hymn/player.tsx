import { getMinTime } from '@/app/lib/hymn/time'
import { addHistoryOfHymnsStorage } from '@/app/lib/storage/history-of-hymns'
import { Hymn, TrackType } from '@/app/lib/types'
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

export default function Player({
  hymn,
  type,
}: {
  hymn: Hymn
  type?: TrackType
}) {
  const [play, setPlay] = useState(false)
  const [volume, setVolume] = useState(100)
  const [mute, setMute] = useState(false)
  const [progress, setProgress] = useState(0)

  const vocal = useRef<HTMLAudioElement | null>(null)
  const instrumental = useRef<HTMLAudioElement | null>(null)

  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audio.current) {
        audio.current.pause()
        audio.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (audio.current) {
      audio.current.currentTime = 0
      audio.current.pause()
    }

    if (type === 'track') {
      if (instrumental.current == null) {
        instrumental.current = new Audio(
          'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/track/hymn-' +
            hymn.number +
            '.mp3'
        )
      }
      if (vocal.current) {
        vocal.current.ontimeupdate = null
        vocal.current.pause()
      }
      audio.current = instrumental.current
    }
    if (type === 'sung') {
      if (vocal.current == null) {
        vocal.current = new Audio(
          'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
            hymn.number +
            '.mp3'
        )
      }
      if (instrumental.current) {
        instrumental.current.ontimeupdate = null
        instrumental.current.pause()
      }
      audio.current = vocal.current
    }
    if (type != null) {
      addHistoryOfHymnsStorage(hymn.number)

      audio.current!.play().then(() => setPlay(true))
      audio.current!.ontimeupdate = () =>
        setProgress(audio.current?.currentTime ?? 0)
    }
    if (type == null) {
      audio.current = null
      if (instrumental.current) {
        instrumental.current.pause()
        instrumental.current.ontimeupdate = null
      }
      if (vocal.current) {
        vocal.current.pause()
        vocal.current.ontimeupdate = null
      }
    }
  }, [type])

  useEffect(() => {
    if (audio.current == null) return
    if (play) {
      audio.current.play()
    } else {
      audio.current.pause()
    }
  }, [play])

  useEffect(() => {
    if (audio.current == null) return
    audio.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    if (audio.current == null) return
    audio.current.muted = mute
  }, [mute])

  if (type == null) return null

  return (
    <>
      <div className='h-20'></div>
      <div className='fixed flex flex-wrap items-center bottom-0 left-0 right-0 h-20 bg-gray-50 bg-backdrop z-10 border-t border-gray-200 gap-2 p-4'>
        <input
          className='accent-black w-full'
          type='range'
          min={0}
          max={
            audio.current?.duration == null || isNaN(audio.current?.duration)
              ? 0
              : audio.current.duration
          }
          step={1}
          onChange={(ev) =>
            audio.current && (audio.current.currentTime = +ev.target.value)
          }
          value={progress}
        />
        <div className='w-full flex justify-between'>
          <section className='flex gap-2'>
            <button onClick={() => setPlay(!play)}>
              {!play ? <IconPlayerPlay /> : <IconPlayerPause />}
            </button>
            <button onClick={() => setMute(!mute)} className='ml-2'>
              {!mute ? (
                volume > 50 ? (
                  <IconVolume />
                ) : volume > 0 ? (
                  <IconVolume2 />
                ) : (
                  <IconVolume3 />
                )
              ) : (
                <IconVolumeOff />
              )}
            </button>
            <input
              className='accent-black'
              type='range'
              min={0}
              max={100}
              step={1}
              onChange={(ev) => setVolume(+ev.target.value)}
              value={volume}
            />
          </section>
          <section>
            {getMinTime(progress)} / {getMinTime(audio.current?.duration ?? 0)}
          </section>
        </div>
      </div>
    </>
  )
}
