const speedRange = document.querySelector('input[name=speed]')
const speedDisplay = document.querySelector('.speed')

function showSpeed () {
  speedDisplay.innerText = speedRange.value
}
speedRange.addEventListener('change', showSpeed)
showSpeed()

export default function getSpeed () {
  return speedRange.value
}
