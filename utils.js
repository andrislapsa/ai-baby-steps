import {
  CREATURE_FACES,
  FOOD_FACES,
} from './consts.js'

MersenneTwister = window.MersenneTwister || function() {
  this.seed = () => null
  this.random = () => Math.random()
}

const mt = new MersenneTwister()
const seed = Math.round(Math.random() * 100000)

export const flatten = (items) =>
  items.reduce((acc, val) => acc.concat(val), [])

export const shuffle = (items) => {
  let counter = items.length;

  // While there are elements in the items
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = items[counter];
    items[counter] = items[index];
    items[index] = temp;
  }

  return items;
}

export const emojisToArray = (EMOJIS) =>
  EMOJIS.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
    .filter(Boolean)

export const getRandomEmoji = (EMOJIS) =>
  EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

export const getRandomCreatureFace = () =>
  getRandomEmoji(CREATURE_FACES)

export const getRandomFoodFace = () =>
  getRandomEmoji(FOOD_FACES)

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
