export default class Player {
  /** @type {HTMLCanvasElement} */
  #canvas
  /** @type {CanvasRenderingContext2D} */
  #ctx

  /** @type {Spawn} */
  #spawn

  /** @type {number} */
  #minRadius
  /** @type {number} */
  #radius

  /** @type {string} */
  #color

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Spawn} spawn
   */
  constructor(canvas, ctx, spawn) {
    this.#canvas = canvas
    this.#ctx = ctx
    this.#spawn = spawn

    this.#minRadius = 15
    this.#radius = 30
    this.#color = "white"
  }

  get x() {
    return this.#spawn.x
  }

  get y() {
    return this.#spawn.y
  }

  get radius() {
    return this.#radius
  }

  update() {
    return this
  }

  draw() {
    this.#ctx.beginPath()
    this.#ctx.arc(
      this.#spawn.x, this.#spawn.y, this.#radius,
      0, Math.PI * 2,
      false
    )
    this.#ctx.fillStyle = this.#color
    this.#ctx.fill()

    return this
  }

  /**
   * @param {number} damage
   */
  hit(damage) {
    this.#radius -= damage
  }

  isDead() {
    return this.#radius <= this.#minRadius
  }
}
