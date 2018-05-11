import {
  createSeededRandom,
  emojisToArray,
} from './utils.js'

const random = createSeededRandom()

export const SERIALIZED_DATA = `
[[-2.0645738358609314,2.3254719858057857,2.2607344487682024,-2.7885570651851554,0.7586145839653916,4.471950425114491,-2.7269154880195843,-0.9246640859171704,1.7232799408026134,2.92312058955432]]
`

export const GENERATED_CREATURE_COUNT = 5
export const USE_SERIALIZED = false

export const CREATURE_SIZE = 10
export const START_X = 5
export const START_Y = 5
export const TICK_LENGTH = 1
export const MAX_AGE = 2000 / TICK_LENGTH // ticks
export const MUTABILITY = .1
export const STREERING_AMPLITUDE = .2
export const FOOD_AMOUNT = 1
export const FOOD_FACES = emojisToArray('🍖🥓🍗🥩🍤🍔🥚🍳🍕')
// export const FOOD_FACES = emojisToArray('🍎🍏🍐🍊🍋🍓🍒🥝🥑🍆🌶🥕')
export const FOOD_SIZE = 75
// export const CREATURE_FACES = emojisToArray('💩')
export const CREATURE_FACES = emojisToArray('🐍🐬💩👻🤑🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🙈🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐚🐞🐜🦗🕷🦂🐢🦎🦖🦕🐙🦑🦐🦀🐡🐠🐟')
export const APETITE = 30 // food that needs to be eaten for everyone to die
// debugger

export const CREATURE_WEIGHTS = USE_SERIALIZED ?
  JSON.parse(SERIALIZED_DATA) :
  [...Array(GENERATED_CREATURE_COUNT)].map(
    () => [...Array(14)].map(() => 2 * random() - 1)
  )
export const CREATURE_COUNT = CREATURE_WEIGHTS.length
