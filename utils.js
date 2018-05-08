import {
  CREATURE_FACES,
} from './consts.js'

MersenneTwister = window.MersenneTwister || function() {
  this.seed = () => null
  this.random = () => Math.random()
}

const mt = new MersenneTwister()
const seed = Math.round(Math.random() * 100000)


export const getRandomCreatureFace = () =>
  CREATURE_FACES[Math.floor(Math.random() * CREATURE_FACES.length)]

// seedEl.innerText = seed
mt.seed(seed)
export function random() {
  return mt.random()
}

export function createCanvasAndGetContext() {
  const canvas = document.createElement('canvas')
  canvas.width = 500
  canvas.height = 500
  canvas.style.border = '1px solid #ccc'
  document.getElementById('canvasRoot').appendChild(canvas)
  return canvas.getContext('2d')
}

export function sig(x) {
  return 1 / (1 + Math.exp(-x))
}

export function calcDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}
