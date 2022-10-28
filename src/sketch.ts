import p5 from "p5"
import { setValues, isDebugMode, width, height, isProduction } from "./globals"
import { handleKeyPress } from "./keypress"

type Circle = {
  sx: number
  sy: number
  x: number
  y: number
  radius: number
  color: p5.Color
}

const SPEED_CHANGE = 0.01
const DRAG = 0.99

const sketch = (p: p5) => {
  setValues(p)

  const circles: Circle[] = []

  p.keyPressed = () => {
    handleKeyPress(p, p.keyCode)
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0, 0, 1)

    for (let i = 0; i < 100; i++) {
      circles.push({
        sx: 0,
        sy: 0,
        x: p.random(0, width),
        y: p.random(0, height),
        radius: p.random(10, 50),
        color: p.color(p.random(0, 50),p.random(0, 255),p.random(0, 50))
      })
    }
  }

  p.draw = () => {
    p.background(200, 255, 200)

    if (isDebugMode && !isProduction) {
      // Render FPS as text
      p.push()
      p.fill(255, 255, 255)
      p.textSize(12)
      p.text(`${p.frameRate().toFixed(2)}fps`, 20, 20)
      p.pop()
    }

    p.push()
    circles.forEach((circle) => {
      circle.sx += p.random(-SPEED_CHANGE, SPEED_CHANGE)
      circle.sy += p.random(-SPEED_CHANGE, SPEED_CHANGE)
      circle.x += circle.sx
      circle.y += circle.sy
      circle.sx *= DRAG
      circle.sy *= DRAG
      p.stroke(0,0,0)
      p.fill(circle.color)
      p.ellipse(circle.x, circle.y, circle.radius, circle.radius)
      if (isDebugMode) {
        p.stroke(255,0,0)
        p.line(circle.x, circle.y, circle.x + circle.sx * 100, circle.y + circle.sy * 100)
      }
    })
    p.pop()
  }
}

new p5(sketch)
