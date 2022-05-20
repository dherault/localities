import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

type PlayerType = {
  id: number
  x: number
  y: number
}

function createPosition() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  }
}

const innerRadius = 2
const speed = 0.05 // px / second

function Player() {
  const socket = useMemo(() => io('ws://localhost:5001'), [])

  const [player, setPlayer] = useState<PlayerType>({
    id: Math.random(),
    ...createPosition(),
  })

  useEffect(() => {
    let paused = false
    let currentX = player.x
    let currentY = player.y
    let objective = createPosition()
    let counter = Math.floor(Math.random() * 10)

    function goToObjective() {
      counter++

      const { x, y } = objective

      const dx = x - currentX
      const dy = y - currentY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 1.5) {
        objective = createPosition()
      }
      else {
        currentX += speed * dx / distance
        currentY += speed * dy / distance

        setPlayer(x => ({ ...x, x: currentX, y: currentY }))

        if (counter % 100 === 0) {
          counter = 0
          socket.emit('position', { x: currentX, y: currentY, z: 0 })
        }
      }

      if (!paused) {
        window.requestAnimationFrame(goToObjective)
      }
    }

    window.requestAnimationFrame(goToObjective)

    return () => {
      paused = true
    }
  // eslint-disable-next-line
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: `calc(${player.y}% - ${innerRadius}px)`,
      left: `calc(${player.x}% - ${innerRadius}px)`,
      width: 2 * innerRadius,
      height: 2 * innerRadius,
      borderRadius: '50%',
      backgroundColor: 'tomato',
    }}
    />
  )
}

/* <Flex
  align="center"
  justify="center"
  position="absolute"
  top={`calc(${player.y}% - ${outerRadius}px)`}
  left={`calc(${player.x}% - ${outerRadius}px)`}
  width={2 * outerRadius}
  height={2 * outerRadius}
  borderRadius="50%"
  cursor="pointer"
  _hover={{ backgroundColor: 'transparency(hover, 50)' }}
>
  <Div
    backgroundColor="tomato"
    width={2 * innerRadius}
    height={2 * innerRadius}
    borderRadius="50%"
  />
</Flex> */
export default Player
