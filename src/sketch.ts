import p5 from "p5"
import { setValues, isDebugMode, width, height, isProduction } from "./globals"
import { handleKeyPress } from "./keypress"

type Gusa = {
  sx: number
  sy: number
  x: number
  y: number
  radius: number
  color: p5.Color
}

const MIN_RADIUS = 5
const MAX_RADIUS = 20


const SPEED_SHIFT = 0.05
//const JUMP_SIZE = 5
const COLOR_SHIFT = 2
const RADIUS_SHIFT = 0.1

const DRAG = 0.99

const constrain = (input: number, min: number, max: number): number => {
  if (min <= input && input <= max) return input
  if (input < min) return min
  // its greater
  return max
}

const isOut = (input: number, min: number, max: number): boolean =>
  input < min || input > max

// doesn't mutate the gusa.
const nextGusa = (p: p5, gusa: Gusa): Gusa => {
  // todo use _.deepCopy(...)

  // shortcut
  const r = (j: number) => p.random(-j, j)

  const color = p.color(
    p.red(gusa.color) + r(COLOR_SHIFT),
    p.green(gusa.color) + r(COLOR_SHIFT),
    p.blue(gusa.color) + r(COLOR_SHIFT)
  )

  let sx = gusa.sx + r(SPEED_SHIFT)
  let sy = gusa.sy + r(SPEED_SHIFT)
  sx *= DRAG
  sy *= DRAG
  
  let x = gusa.x + sx
  if (isOut(x, 0, width)) x = p.random(0, width)
  let y = gusa.y + sy
  if (isOut(y, 0, height)) y = p.random(0, height)

  const radius = constrain(
    gusa.radius + r(RADIUS_SHIFT),
    MIN_RADIUS,
    MAX_RADIUS
  )

  return { sx, sy, x, y, radius, color }
}

const sketch = (p: p5) => {
  setValues(p)

  const firstGusa: Gusa = {
    sx: 0,
    sy: 0,
    x: p.random(0, width),
    y: p.random(0, height),
    radius: p.random(MIN_RADIUS, MAX_RADIUS),
    color: p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255)),
  }

  let gusas: Gusa[] = [firstGusa]

  p.keyPressed = () => {
    handleKeyPress(p, p.keyCode)
  }

  p.mousePressed = () => {
    gusas.push({
      sx: 0,
      sy: 0,
      x: p.mouseX,
      y: p.mouseY,
      radius: p.random(MIN_RADIUS, MAX_RADIUS),
      color: p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255)),
    })
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0, 0, 1)
  }

  p.draw = () => {
    /*if (isDebugMode && !isProduction) {
      // Render FPS as text
      p.push()
      p.fill(255, 255, 255)
      p.textSize(12)
      p.text(`${p.frameRate().toFixed(2)}fps`, 20, 20)
      p.pop()
    }*/

    p.push()

    // process gusa things
    gusas = gusas.map(gusa => nextGusa(p, gusa))
    // render
    p.noStroke()
    gusas.forEach(gusa => {
      p.fill(gusa.color)
      p.circle(gusa.x, gusa.y, gusa.radius)
    })

    p.pop()
  }
}

new p5(sketch)
