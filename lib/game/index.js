import Enemy from "../enemy"
import Player from "../player"
import Projectile from "../projectile"

export default class Game {
  /** @type {HTMLCanvasElement} */
  #canvas
  /** @type {CanvasRenderingContext2D} */
  #ctx

  /** @type {Player} */
  #player
  /** @type {Projectile[]} */
  #projectiles

  /** @type {Enemy[]} */
  #enemies
  /** @type {number} */
  #lastEnemySpawnTime

  /**
   * This will let the player shoot some enemy
   * @type {((ev: MouseEvent) => void|Promise<void>)}
   */
  #onclick

  /**
  * @param {HTMLCanvasElement} canvas
  * @param {CanvasRenderingContext2D} ctx
  */
  constructor(canvas, ctx) {
    this.#canvas = canvas
    this.#ctx = ctx

    // TODO: Add a debug overlay (toggle on/off on keypress "d" or two finger touch)

    this.#player = new Player(this.#canvas, this.#ctx, {
      x: this.#canvas.width / 2, y: this.#canvas.height / 2
    })

    this.#projectiles = []

    this.#enemies = []
    this.#lastEnemySpawnTime = 0

    this.#onclick = async (ev) => {
      // Create a new projectile
      const angle = Math.atan2(ev.clientY - (this.#canvas.height / 2), ev.clientX - (this.#canvas.width / 2))
      this.#projectiles.push(
        new Projectile(
          this.#canvas, this.#ctx,
          {
            x: Math.cos(angle) * 4,
            y: Math.sin(angle) * 4,
          }
        )
      )
    }
  }

  stop() {
    // Kill all running event listeners here
    window.removeEventListener("click", this.#onclick)

    return this
  }

  run() {
    window.addEventListener("click", this.#onclick)

    /** @param {number} time */
    const animate = (time) => {
      this.#spawnEnemy(time)

      this.#ctx.fillStyle = "rgba(0, 0, 0, .1)"
      this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)

      this.#player.update().draw()
      this.#projectiles.forEach(p => p.update().draw())

      const newEnemies = []
      this.#enemies.forEach((e) => {
        e.update().draw()

        this.#handlePlayerCollision(e)
        if (this.#player.isDead() || e.isDead()) {
          // NOTE: If the enemy does a hit on the enemy, he will die (the enemy)
          return
        }

        this.#handleProjectileCollision(e)
        if (!e.isDead()) {
          newEnemies.push(e)
        }
      })
      this.#enemies = newEnemies

      if (!this.#player.isDead()) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
    return this
  }

  isGameOver() {
    return this.#player.isDead()
  }

  /**
   * @param {number} time
   */
  #spawnEnemy(time) {
    // FIXME: There is a problem when tabbing out and in
    if (time - this.#lastEnemySpawnTime <= 2000) {
      return
    }
    this.#lastEnemySpawnTime = time

    const minRadius = 15
    const maxRadius = 30
    const radius = (Math.random() * minRadius) + (maxRadius - minRadius)
    if (radius <= minRadius) throw `Oooops enemy already spawned dead` // TODO: Is this possible?

    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() * this.#canvas.width
      y = (Math.random() < 0.5) ? 0 - radius : this.#canvas.height + radius
    } else {
      x = (Math.random() < 0.5) ? 0 - radius : this.#canvas.width + radius
      y = Math.random() * this.#canvas.height
    }

    {
      // NOTE: atan2: The point where the player is (center of the screen) - the point where the enemy is
      const angle = Math.atan2((this.#canvas.height / 2) - y, (this.#canvas.width / 2) - x)

      this.#enemies.push(
        new Enemy(
          this.#canvas, this.#ctx, minRadius, radius, maxRadius,
          { x: x, y: y }, // Spawn
          { x: Math.cos(angle), y: Math.sin(angle) } // Velocity
        )
      )
    }

    return this
  }

  /**
   * @param {Enemy} enemy
   */
  #handleProjectileCollision(enemy) {
    // NOTE: hypot: The distance between two points
    const newProjectiles = []
    this.#projectiles.forEach((p) => {
      if (
        (p.x < 0 - p.radius || p.x > this.#canvas.width + p.radius) ||
        (p.y < 0 - p.radius || p.y > this.#canvas.height + p.radius)
      ) {
        // Remove out of screen projectiles from tha array
        return
      }

      // Remove projectiles on enemy hit
      if (Math.hypot(p.x - enemy.x, p.y - enemy.y) > enemy.radius) {
        newProjectiles.push(p)
      } else {
        enemy.hit(p.damage)
      }
    })
    this.#projectiles = newProjectiles

    return this
  }

  /**
   * @param {Enemy} enemy
   */
  #handlePlayerCollision(enemy) {
    if (Math.hypot(this.#player.x - enemy.x, this.#player.y - enemy.y) < this.#player.radius + enemy.radius) {
      this.#player.hit(enemy.damage)
    }

    return this
  }
}
