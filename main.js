import './styles/main.css'
import Game from './lib/game';

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;

document.querySelector('#app').innerHTML = `
  <canvas><canvas>
`

async function main() {
  canvas = document.querySelector("canvas")
  ctx = canvas.getContext("2d")

  /*
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  */

  await windowResizeHandler()
  window.addEventListener("resize", windowResizeHandler)

  const game = new Game(canvas, ctx)
  // TODO: Add event listener to game "gameover" and handle the game over screen
  game.run()
}

async function windowResizeHandler() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

main()
