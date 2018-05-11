import {
  START_X,
  START_Y,
  STREERING_AMPLITUDE,
} from './consts.js'
import {
  createSeededRandom,
  getRandomCreatureFace,
  sig,
} from './utils.js'

const random = createSeededRandom()

export class Creature {
  constructor({ x = START_X, y = START_Y, weights }) {
    this.v = 1
    this.x = x // Math.floor(random() * 500)
    this.y = y // Math.floor(random() * 500)
    this.theta = random() * 2 * Math.PI
    this.weights = weights
    this.foodEaten = 0
    this.name = getRandomCreatureFace()
  }

  eat () {
    this.foodEaten += 1
  }

  acceerate() {
    this.v += 1
  }

  brake() {
    this.v -= 1
  }

  steer(diff) {
    this.theta += diff
  }

  updateParameters({ distanceToFood }) {
    const previousDistanceToFood = this.previousDistanceToFood || distanceToFood;
    const distanceDiff = previousDistanceToFood - distanceToFood
    const inputs = [distanceToFood, previousDistanceToFood, this.theta, this.v]
    const weights = this.weights
    // const z0 = sig(inputs.reduce((sum, value, i) => sum + value * weights[i], 0))
    const z0 = sig(inputs.reduce((sum, value, i) => sum + value * weights.slice(0, 4)[i], 0))
    const z1 = sig(inputs.reduce((sum, value, i) => sum + value * weights.slice(4, 8)[i], 0))
    const x0 = sig([z0, z1].reduce((sum, value, i) => sum + value * weights.slice(8, 10)[i], 0))
    const x1 = sig([z0, z1].reduce((sum, value, i) => sum + value * weights.slice(10, 12)[i], 0))
    const x2 = sig([z0, z1].reduce((sum, value, i) => sum + value * weights.slice(12, 14)[i], 0))
    const x3 = sig([z0, z1].reduce((sum, value, i) => sum + value * weights.slice(14, 16)[i], 0))
    // const z1 = sig(inputs.reduce((sum, value, i) => sum + value * weights.slice(4, 8)[i], 0))
    // const out0 = sig([z0].reduce((sum, value, i) => sum + value * weights.slice(8, 10)[i], 0))
    // const out1 = sig([z0, z1].reduce((sum, value , i) => sum + value * weights.slice(10, 12)[i], 0))

    // inputsEl.innerText = inputs.join()
    // weightsEl.innerText = weights.join()
    // hiddenEl.innerText = [z0, z1].join()
    // outputsEl.innerText = [out0, out1].join()

    // console.log('hei', z0)

    const out0 = sig([x0, x1].reduce((sum, value, i) => sum + value * weights.slice(12, 14)[i], 0))
    // const out = ((z0 + z1) / 2);

    this.steer((out0 * 2 * STREERING_AMPLITUDE) - STREERING_AMPLITUDE)

    this.previousDistanceToFood = distanceToFood;
  }

  tick() {
    this.x = this.x + this.v * Math.cos(this.theta)
    this.y = this.y + this.v * Math.sin(this.theta)
  }

  draw(ctx) {
    // ctx.arc(this.x, this.y, CREATURE_SIZE / 2, 0, 2 * Math.PI)
    // ctx.moveTo(this.x, this.y)
    // ctx.lineTo(this.x + CREATURE_SIZE * Math.cos(this.theta), this.y + CREATURE_SIZE * Math.sin(this.theta))
    
    ctx.font = '24px serif';
    ctx.fillStyle = 'black'
    ctx.fillText(this.name, this.x - 12, this.y + 8);
  }
}
