import { FRAME_LENGTH } from './consts.js'
import getSpeed from './getSpeed.js'

export default function worldTick (onTick) {
  let stop
  let shouldBreak = false
  const id = setInterval(() => {
    const ticksPerFrame = Math.round(getSpeed() / FRAME_LENGTH)
    for (var i = 0; i < ticksPerFrame; i++) {
      onTick(stop)
      if (shouldBreak) {
        break;
      }
    }
  }, FRAME_LENGTH)

  stop = () => {
    shouldBreak = true
    clearInterval(id)
  }
}
