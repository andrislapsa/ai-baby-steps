import {
  TICK_LENGTH,
  MAX_AGE,
  MUTABILITY,
  FOOD_AMOUNT,
  FOOD_SIZE,
  APETITE,
  CREATURE_WEIGHTS,
  CREATURE_COUNT,
} from './consts.js'
import { Creature } from './Creature.js'
import {
  random,
  createCanvasAndGetContext,
  calcDistance,
} from './utils.js'

const genEl = document.querySelector('.gen')
const bestEl = document.querySelector('.best')
const seedEl = document.querySelector('.seed')
const inputsEl = document.querySelector('.inputs')
const weightsEl = document.querySelector('.weights')
const hiddenEl = document.querySelector('.hidden')
const outputsEl = document.querySelector('.outputs')
const top10 = document.querySelector('.top10')
const generationsLog = document.querySelector('.generations')
const progressBar = document.querySelector('.lifetime')

progressBar.max = MAX_AGE

function tick({ ctx, creatures, food, generateNewFood, resolve }) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  food.forEach(foodPiece => {
    // ctx.beginPath()
    // ctx.arc(foodPiece.x, foodPiece.y, FOOD_SIZE, 0, 2 * Math.PI)
    // ctx.closePath()
    // ctx.fillStyle = 'red'
    // ctx.fill()

    ctx.font = `${FOOD_SIZE * 2.2}px serif`;
    ctx.fillText('🍎', foodPiece.x - FOOD_SIZE * 1.09, foodPiece.y + FOOD_SIZE * .7);
  })
  creatures.forEach(creature => {
    const closestFoodDistance = food.reduce((closest, current) => calcDistance(current, creature) < closest ? calcDistance(current, creature) : closest, Infinity)
    if (closestFoodDistance <= FOOD_SIZE) {
      creature.eat()
      food.splice(food.findIndex(f => calcDistance(f, creature) === closestFoodDistance), 1)
      generateNewFood()
      if (creature.foodEaten >= APETITE) {
        resolve(creatures)
      }
    }
    const distanceToFood = closestFoodDistance / ctx.canvas.width;
    creature.distanceToFood = distanceToFood
    creature.updateParameters({
      distanceToFood,
    })
    creature.tick()
    ctx.beginPath()
    creature.draw(ctx)
    ctx.closePath()
    ctx.stroke()
  })
  const sortedCreatures = sort(creatures);
  // bestEl.innerHTML = sortedCreatures[0].foodEaten

  const topPerformerRank = sortedCreatures.slice(0, 9)
    .map(creature => creature.distanceToFood)
    .join('\n')
  top10.innerHTML = topPerformerRank
}

function average(data) {
  return data.reduce((a, b) => a + b, 0) / data.length
}

function logGeneration(genNr, creatureDistances, creatureEatenFood) {
  const logItem = document.createElement('pre')

  // const worstPerformer = creatureDistances[creatureDistances.length - 1]
  // const averagePerformance = average(creatureDistances)

  const bestPerformer = creatureEatenFood[0]
  const worstPerformer = creatureEatenFood[creatureEatenFood.length - 1]
  const averagePerformance = average(creatureEatenFood)

  logItem.innerHTML = `#${genNr} avg: ${averagePerformance.toFixed(5)} best: ${bestPerformer} worst: ${worstPerformer.toFixed(5)}`
  generationsLog.appendChild(logItem)
}

function generateFood(ctx) {
  return {
    x: random() * ctx.canvas.width,
    y: random() * ctx.canvas.height,
  }
}

function live(creatures, ctx) {
  let tickerId
  let food = [...Array(FOOD_AMOUNT)].map(() => generateFood(ctx))
  const generateNewFood = () => food.push(generateFood(ctx))
  return new Promise((resolve) => {
    tick({ ctx, creatures, food, generateNewFood, resolve })
    let ticks = 1
    tickerId = setInterval(() => {
      tick({ ctx, creatures, food, generateNewFood, resolve })
      ticks += 1
      if (ticks > MAX_AGE) {
        resolve(creatures)
      }
      progressBar.value = ticks
    }, TICK_LENGTH)
  }).then(creatures => {
    clearInterval(tickerId)
    return creatures
  })
}

function sort(creatures) {
  return creatures.slice().sort((a, b) => b.foodEaten - a.foodEaten)
  // return creatures.slice().sort((a, b) => b.distanceToFood - a.distanceToFood)
}

window.sort = sort

function killHalf(creatures) {
  // return creatures.slice(0, creatures.length / 2)
  let deathCount = 0
  return creatures.filter((creature, i) => {
    const probabilityOfDeath = (i + 1) / creatures.length
    if (random() < probabilityOfDeath) {
      deathCount += 1
      if (deathCount < creatures.length / 2) {
        return false
      }
    }
    return true
  }).slice(0, creatures.length / 2)
}

function mutate(creatures) {
  return creatures.map(creature => new Creature({
    weights: creature.weights.map(w => w + MUTABILITY * random() - MUTABILITY / 2)
  }))
}

let genCount = 0
function runGeneration(creatures, ctx) {
  window.currentCreatures = creatures
  console.log('New gen!')
  genCount += 1
  genEl.innerText = genCount
  live(creatures, ctx)
    .then(creatures => {
      const sortedCreatures = sort(creatures)
      const creatureDistances = sortedCreatures.map(creature => creature.distanceToFood)
      const creatureEatenFood = sortedCreatures.map(creature => creature.foodEaten)
      logGeneration(genCount, creatureDistances, creatureEatenFood)
      const best = killHalf(sortedCreatures)
      const newCreatures = mutate(best).concat(mutate(best))
      window.newCreatures = newCreatures
      runGeneration(newCreatures, ctx)
      // debugger
    })
    .catch((err) => {
      console.log('Gen failed', err);
      // runGeneration(creatures, ctx)
    })
}

const context = createCanvasAndGetContext()


const creatures = [...Array(CREATURE_COUNT)].map((item, key) => {
  window.creature = new Creature({
    weights: CREATURE_WEIGHTS[key],
  });

  return window.creature;
})
runGeneration(creatures, context)

// window.addEventListener('keydown', ({ keyCode }) => {
//   switch (keyCode) {
//     case 39:
//       creature.steerRight()
//       break
//     case 37:
//       creature.steerLeft()
//       break
//     case 38:
//       creature.acceerate()
//       break
//     case 40:
//       creature.brake()
//       break
//   }
// })
