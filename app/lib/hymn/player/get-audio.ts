import { addHistoryOfHymnsStorage } from '../../storage/history-of-hymns'

export async function getAudio(hymnNumber: number) {
  const audio = new Audio()

  await new Promise<void>((resolve, reject) => {
    audio.addEventListener('loadeddata', () => resolve())
    audio.addEventListener('error', (ev) => {
      reject(ev.message)
      alert(ev.message)
    })
    audio.src =
      'https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-' +
      hymnNumber +
      '.mp3'
    audio.load()
  })

  addHistoryOfHymnsStorage(hymnNumber)

  return audio
}

export function destroyAudio(audio: HTMLAudioElement) {
  audio.pause()
  audio.remove()
}
