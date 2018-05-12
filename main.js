import {
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
  createSeededRandom,
  createRandomSeed,
  createCanvasAndGetContext,
  calcDistance,
  getRandomFoodFace,
  flatten,
  shuffle,
} from './utils.js'
import graphGeneration from './graphGeneration.js'
import worldTick from './worldTick.js'

const random = createSeededRandom()

const genEl = document.querySelector('.gen')
const bestEl = document.querySelector('.best')
const inputsEl = document.querySelector('.inputs')
const weightsEl = document.querySelector('.weights')
const hiddenEl = document.querySelector('.hidden')
const outputsEl = document.querySelector('.outputs')
const top10 = document.querySelector('.top10')
const generationsLog = document.querySelector('.generations')
const progressBar = document.querySelector('.lifetime')
const drawToggleInput = document.querySelector('[name="drawEnabled"]')

progressBar.max = MAX_AGE
window.DRAW = true

drawToggleInput.addEventListener('change', elem => {
  window.DRAW = elem.target.checked
})

function tick({ ctx, creatures, food, generateNewFood }) {
  if (DRAW) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    food.forEach(foodPiece => {
      ctx.font = `${FOOD_SIZE * 2.2}px serif`;
      ctx.fillText(foodPiece.face, foodPiece.x - FOOD_SIZE * 1.09, foodPiece.y + FOOD_SIZE * .7);
    })
  }

  creatures.forEach(creature => {
    const closestFoodDistance = food.reduce((closest, current) => calcDistance(current, creature) < closest ? calcDistance(current, creature) : closest, Infinity)
    if (closestFoodDistance <= FOOD_SIZE) {
      creature.eat()
      food.splice(food.findIndex(f => calcDistance(f, creature) === closestFoodDistance), 1)
      generateNewFood()
      if (creature.foodEaten >= APETITE) {
        console.log('fed up', creature)
        // resolve(creatures)
      }
    }
    const distanceToFood = closestFoodDistance / ctx.canvas.width;
    creature.distanceToFood = distanceToFood
    creature.updateParameters({
      distanceToFood,
    })
    creature.tick()

    if (DRAW) {
      ctx.beginPath()
      creature.draw(ctx)
      ctx.closePath()
      ctx.stroke()
    }
  })

  return creatures
  // const sortedCreatures = sort(creatures);
  // bestEl.innerHTML = sortedCreatures[0].foodEaten

  // const topPerformerRank = sortedCreatures.slice(0, 9)
  //   .map(creature => creature.distanceToFood)
  //   .join('\n')
  // top10.innerHTML = topPerformerRank
}

function average(data) {
  return data.reduce((a, b) => a + b, 0) / data.length
}

function logGeneration(genNr, creatureDistances, creatureEatenFood) {
  const logItem = document.createElement('pre')

  // const worstPerformer = creatureDistances[creatureDistances.length - 1]
  // const averagePerformance = average(creatureDistances)

  const bestPerformer = creatureEatenFood[0]
  const top10AveragePerformance = average(creatureEatenFood.slice(0, 10))
  const worstPerformer = creatureEatenFood[creatureEatenFood.length - 1]
  const averagePerformance = average(creatureEatenFood)

  console.log('gen log', genNr, { creatureDistances, creatureEatenFood })

  logItem.innerHTML = `gen #${genNr} | best: ${bestPerformer} | top10 avg: ${top10AveragePerformance.toFixed(3)} | avg: ${averagePerformance.toFixed(3)} | worst: ${worstPerformer.toFixed(3)}`
  generationsLog.appendChild(logItem)

  graphGeneration(genNr, { bestPerformer, top10AveragePerformance, averagePerformance, worstPerformer })
}

function generateFood(ctx, rnd) {
  return {
    face: getRandomFoodFace(),
    x: rnd() * ctx.canvas.width,
    y: rnd() * ctx.canvas.height,
  }
}

function live(creatures, ctx, seed) {
  // let tickerId
  console.log(1, seed)
  const rnd = createSeededRandom(seed)
  let food = [...Array(FOOD_AMOUNT)].map(() => generateFood(ctx, rnd))
  const generateNewFood = () => food.push(generateFood(ctx, rnd))

  return () => tick({ ctx, creatures, food, generateNewFood })
  // return new Promise((resolve) => {
  //
  //   tick({ ctx, creatures, food, generateNewFood, resolve })
  //   let ticks = 1
  //   tickerId = planckLength(() => {
  //     tick({ ctx, creatures, food, generateNewFood, resolve })
  //     ticks += 1
  //     if (ticks > MAX_AGE) {
  //       resolve(creatures)
  //     }
  //     progressBar.value = ticks
  //   })
  // }).then(creatures => {
  //   clearInterval(tickerId)
  //   return creatures
  // })
}

function sort(creatures) {
  return creatures.slice().sort((a, b) =>
    a.foodEaten === b.foodEaten ? (a.distanceToFood - b.distanceToFood) : (b.foodEaten - a.foodEaten)
  )
  // return creatures.slice().sort((a, b) => b.foodEaten - a.foodEaten)
  // return creatures.slice().sort((a, b) => b.distanceToFood - a.distanceToFood)
}

window.sort = sort

function killHalf(creatures) {
  return creatures.slice(0, creatures.length / 2)
  // let deathCount = 0
  // return creatures.filter((creature, i) => {
  //   const probabilityOfDeath = (i + 1) / creatures.length
  //   if (random() < probabilityOfDeath) {
  //     deathCount += 1
  //     if (deathCount < creatures.length / 2) {
  //       return false
  //     }
  //   }
  //   return true
  // }).slice(0, creatures.length / 2)
}

function mutate(creatures) {
  return creatures.map(creature => new Creature({
    weights: creature.weights.map(w => w + MUTABILITY * random() - MUTABILITY / 2)
  }))
}

function cloneCreatures(creatures) {
  return creatures.map(creature => new Creature({
    weights: creature.weights,
  }))
}


function runGeneration(creatures, ctx) {
  // window.currentCreatures = creatures
  // console.log('New gen!')
  // genCount += 1
  // genEl.innerText = genCount
  return live(creatures, ctx);
}

// const context = createCanvasAndGetContext()

const generateCreatures = () =>
  [...Array(CREATURE_COUNT)].map((item, key) =>
    new Creature({
      weights: CREATURE_WEIGHTS[key],
    })
  )

const creatures = generateCreatures()

let genCount = 0
const seed = createRandomSeed()
function runSimulations(simulations) {
  genCount++
  // return new Promise((resolve) => {
  //
  //   tick({ ctx, creatures, food, generateNewFood, resolve })
  //   let ticks = 1
  //   tickerId = planckLength(() => {
  //     tick({ ctx, creatures, food, generateNewFood, resolve })
  //     ticks += 1
  //     if (ticks > MAX_AGE) {
  //       resolve(creatures)
  //     }
  //     progressBar.value = ticks
  //   })
  // }).then(creatures => {
  //   clearInterval(tickerId)
  //   return creatures
  // })
  const simulationTickers = simulations
    .map(({ creatures, ctx }) => live(creatures, ctx, seed))

  const simulationsCount = simulations.length

  let ticks = 1
  worldTick(stop => {
    ticks++
    progressBar.value = ticks

    const allCreatures = flatten(simulationTickers.map(ticker => ticker()))

    if (ticks > MAX_AGE) {
      stop()

      const sortedCreatures = sort(allCreatures)
      const creatureDistances = sortedCreatures.map(creature => creature.distanceToFood)
      const creatureEatenFood = sortedCreatures.map(creature => creature.foodEaten)
      logGeneration(genCount, creatureDistances, creatureEatenFood)
      const best = killHalf(sortedCreatures)
      const newCreatures = shuffle(mutate(best).concat(cloneCreatures(best)))
        .reduce((acc,item,i) => {
          acc[i % acc.length].push(item)
          return acc
        }, [...Array(simulationsCount)].map(() => []))

      // console.log('max age reached', allCreatures, newCreatures) //, allCreatures, flatten(allCreatures))
      const newSimulations = simulations.map(({ _, ctx }, key) => ({
        creatures: newCreatures[key],
        ctx,
      }))

      runSimulations(newSimulations)
    }
  })
}

const simulations = [...Array(64)]
  .map(() => ({ creatures: generateCreatures(), ctx: createCanvasAndGetContext() }))

runSimulations(simulations)
// runGeneration(creatures, context)
// runGeneration(creatures, context1)

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
