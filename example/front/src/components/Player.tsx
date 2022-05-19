import { useCallback, useEffect, useState } from 'react'
import { Div, Flex, Tooltip } from 'honorable'

type PlayerType = {
  id: number
  name: string
  x: number
  y: number
}

type Position = {
  x: number
  y: number
}

function createPosition() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  }
}

const outerRadius = 8
const innerRadius = 2
const speed = 1 // px / second

function Player() {
  const [player, setPlayer] = useState<PlayerType>(() => {
    const id = Math.random()

    return {
      id,
      name: `Player ${id}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }
  })

  const [objective, setObjective] = useState<Position>(createPosition())

  const goToObjective = useCallback(() => {
    const { x, y } = objective
    const nextPlayer = { ...player }

    const dx = x - nextPlayer.x
    const dy = y - nextPlayer.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 1) {
      setObjective(createPosition())

      return
    }

    const dt = speed / distance

    nextPlayer.x += dx * dt
    nextPlayer.y += dy * dt

    setPlayer(nextPlayer)
    setTimeout(goToObjective, 1000 / 60)
  }, [player, objective])

  useEffect(() => {
    goToObjective()
  }, [goToObjective])

  return (
    <Tooltip label={player.name}>
      <Flex
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
      </Flex>
    </Tooltip>
  )
}

export default Player
