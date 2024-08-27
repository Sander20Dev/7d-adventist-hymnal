import { useContext } from 'react'
import { AudioControllerCtx } from '../../provider'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { getMinTime } from '@/app/lib/hymn/time'

export default function Controls() {
  const { played, audio, time } = useContext(AudioControllerCtx)
  return (
    <div className='w-screen items-center p-2 gap-2 h-16 bg-white bg-backdrop flex'>
      <button onClick={() => played.set(!played.current)}>
        {!played.current ? <IconPlayerPlay /> : <IconPlayerPause />}
      </button>
      <input
        className='accent-current w-full'
        type='range'
        step={1}
        min={0}
        max={audio?.duration}
        value={time.current}
        onChange={(ev) => time.set(+ev.target.value)}
      />
      <span>
        {getMinTime(time.current)}/{getMinTime(audio?.duration ?? NaN)}
      </span>
    </div>
  )
}
