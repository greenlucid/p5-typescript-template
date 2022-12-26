import p5 from "p5"
import { setValues, isDebugMode, width, height, isProduction } from "./globals"
import { handleKeyPress } from "./keypress"

const sketch = (p: p5) => {
  setValues(p)

  let color: p5.Color

  p.keyPressed = () => {
    handleKeyPress(p, p.keyCode)
  }

  p.mousePressed = () => {
    color = p.color(
      p.random(0, 255),
      p.random(0, 255),
      p.random(0, 255)
    )
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    // colors are: red, green, blue
    p.background(100, 200, 255)
    color = p.color(255, 255, 255)
  }

  p.draw = () => {
    p.background(100, 200, 255)
    p.fill(color)
    p.circle(p.mouseX, p.mouseY, 100)
  }
}

new p5(sketch)
