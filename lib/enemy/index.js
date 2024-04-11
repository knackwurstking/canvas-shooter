export default class Enemy {
  /** @type {HTMLCanvasElement} */
  #canvas
  /** @type {CanvasRenderingContext2D} */
  #ctx

  /** @type {Spawn} */
  #spawn

  /** @type {number} */
  #minRadius // radius
  /** @type {number} */
  #radius // radius
  /** @type {number} */
  #maxRadius // radius

  /** @type {string} */
  #color
  /** @type {number} */
  #hue
  /** @type {number} */
  #saturation
  /** @type {Velocity} */
  #velocity
  /** @type {number} */
  #damage

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} minRadius
   * @param {number} radius
   * @param {number} maxRadius
   * @param {Spawn} spawn
   * @param {Velocity} velocity
   */
  constructor(canvas, ctx, minRadius, radius, maxRadius, spawn, velocity) {
    // TODO: Refactor this radius parameter stuff 
    this.#canvas = canvas
    this.#ctx = ctx

    this.#spawn = spawn
    this.#minRadius = minRadius
    this.#radius = radius
    this.#maxRadius = maxRadius

    this.#hue = 120 / (this.#maxRadius - this.#minRadius) * (this.#radius - this.#minRadius)

    this.#velocity = velocity
    this.#damage = 0
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

  get damage() {
    this.#radius = this.#minRadius 
    return this.#radius / 2 // Half the radius will be the damage output
  }

  update() {
    if (this.#damage > 0) {
      this.#radius -= 1
      this.#damage -= 1

      if (this.#damage <= 0) {
        this.#damage = 0
      }
    }

    this.#spawn.x += this.#velocity.x
    this.#spawn.y += this.#velocity.y

    this.#color = `hsl(${this.#hue}, ${100 / (this.#maxRadius - this.#minRadius) * (this.#radius - this.#minRadius)}%, 50%)`

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
    this.#damage += damage
  }

  isDead() {
    return this.#radius <= this.#minRadius
  }
}
