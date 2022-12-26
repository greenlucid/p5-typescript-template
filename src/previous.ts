import p5 from "p5"
import { setValues, isDebugMode, width, height, isProduction } from "./globals"
import { handleKeyPress } from "./keypress"

// all particles have "mass" 1
type Atom = {
  vx: number
  vy: number
  x: number
  y: number
  kind: number
}

const N_COLORS = 4
const N_ATOMS_PER = 100

const genRules = (p: p5): number[][] => {
  const rules = []
  const r = (j: number) => p.random(-j, j)

  for (let i = 0; i < N_COLORS; i++) {
    const row = []
    for (let j = 0; j < N_COLORS; j++) {
      row.push(r(0.00001))
    }
    rules.push(row)
  }
  console.log({rules})
  return rules
}

const constrain = (input: number, min: number, max: number): number => {
  if (min <= input && input <= max) return input
  if (input < min) return min
  // its greater
  return max
}

const isOut = (input: number, min: number, max: number): boolean =>
  input < min || input > max

const sketch = (p: p5) => {
  setValues(p)

  const createAtoms = (perKind: number): Atom[] => {
    const atoms: Atom[] = []

    for (let i = 0; i < N_COLORS; i++) {
      for (let c = 0; c < perKind; c++) {
        atoms.push({
          kind: i,
          vx: 0,
          vy: 0,
          x: Math.random() * width,
          y: Math.random() * height,
        })
      }
    }

    return atoms
  }

  let atoms: Atom[] = []

  // there are 7 colors
  const kindToColor = [
    p.color(255, 0, 0),
    p.color(0, 255, 0),
    p.color(0, 0, 255),
    p.color(255, 255, 0),
    p.color(255, 0, 255),
    p.color(0, 255, 255),
    p.color(255, 255, 255),
  ]

  const rules = genRules(p)

  console.log({ rules })

  const renderParticles = () => {
    p.push()
    p.noStroke()
    for (const atom of atoms) {
      p.fill(kindToColor[atom.kind])
      p.circle(atom.x, atom.y, 3)
    }
    p.pop()
  }

  const advanceParticles = (atoms: Atom[], rules: number[][]): Atom[] => {
    const newAtoms = []
    for (const a of atoms) {
      let fx = 0
      let fy = 0
      for (const b of atoms) {
        const g = rules[a.kind][b.kind]
        if (Math.random() < 0.0000001) console.log({a, b, g})
        const dx = a.x - b.x
        const dy = a.y - b.y
        // force
        if (dx !== 0 || dy !== 0) {
          const d = Math.sqrt(dx * dx + dy * dy)
          const f = g / d
          // extract force components
          fx += (f * dx)
          fy += (f * dy)
        }
      }
      let vx = a.vx + fx * 0.5
      let vy = a.vy + fy * 0.5
      let x = a.x + a.vx
      let y = a.y + a.vy
      const kind = a.kind

      // boundaries
      if (x < 0) {
        x = -x
        vx *= -0.1
      }
      if (x >= width) {
        x = 2 * width - x
        vx *= -0.1
      }
      if (y < 0) {
        y = -y
        vy *= -0.1
      }
      if (y >= height) {
        y = 2 * height - y
        vy *= -0.1
      }

      const atom = { vx, vy, x, y, kind }
      newAtoms.push(atom)
    }
    return newAtoms
  }

  p.keyPressed = () => {
    handleKeyPress(p, p.keyCode)
  }

  p.mousePressed = () => {}

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0, 0, 1)
    atoms = createAtoms(N_ATOMS_PER)
  }

  p.draw = () => {
    p.background(20, 20, 20)

    atoms = advanceParticles(atoms, rules)
    renderParticles()
  }
}

new p5(sketch)
