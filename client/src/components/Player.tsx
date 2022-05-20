import { ReactNode, useEffect, useMemo, useState } from 'react'
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

const radius = 4
const speed = 0.05 // px / second
const positionEmitFrequency = 33
const sprintFrequency = 333
const suroundingRadius = 12

function Player({ selected, hidden, onClick }: any) {
  const socket = useMemo(() => io('ws://localhost:5001'), [])
  const [suroundingPlayers, setSuroundingPlayers] = useState<any[]>([])
  const [isSprinting, setIsSprinting] = useState(Math.random() > 0.75)

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
    let sprintCounter = 0

    function goToObjective() {
      counter++
      sprintCounter++

      const { x, y } = objective
      const dx = x - currentX
      const dy = y - currentY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 1.5) {
        objective = createPosition()
      }
      else {
        currentX += (isSprinting ? 2.5 : 1) * speed * dx / distance
        currentY += (isSprinting ? 2.5 : 1) * speed * dy / distance

        setPlayer(x => ({ ...x, x: currentX, y: currentY }))

        if (counter % positionEmitFrequency === 0) {
          counter = 0
          socket.emit('position', { x: currentX, y: currentY, z: 0 })
        }

        if (sprintCounter % sprintFrequency === 0 && Math.random() > 0.75) {
          sprintCounter = 0
          setIsSprinting(x => !x)
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
  }, [isSprinting])

  useEffect(() => {
    if (!selected) return

    socket.on('players', (players: any[]) => {
      console.log('players', players)

      setSuroundingPlayers(players)
    })

    return () => {
      socket.off('players')
    }
  }, [selected, socket])

  function renderSuroundingPlayers() {
    const players: ReactNode[] = []

    suroundingPlayers.forEach(({ id, positionX, positionY }) => {
      players.push(
        <div
          key={id}
          style={{
            position: 'absolute',
            top: `calc(${positionY}% - ${radius}px)`,
            left: `calc(${positionX}% - ${radius}px)`,
            width: 2 * radius,
            height: 2 * radius,
            borderRadius: '50%',
            backgroundColor: 'lightskyblue',
          }}
        />
      )
    })

    return players
  }

  function renderSuroundingRadius() {
    return (
      <div
        style={{
          opacity: 0.333,
          position: 'absolute',
          top: `calc(${player.y}% - ${suroundingRadius}%)`,
          left: `calc(${player.x}% - ${suroundingRadius}%)`,
          width: `${2 * suroundingRadius}%`,
          height: `${2 * suroundingRadius}%`,
          border: '1px solid lightskyblue',
        }}
      />
    )
  }

  return (
    <>
      <div
        style={{
          opacity: hidden ? 0.333 : 1,
          position: 'absolute',
          top: `calc(${player.y}% - ${radius}px)`,
          left: `calc(${player.x}% - ${radius}px)`,
          width: 2 * radius,
          height: 2 * radius,
          borderRadius: '50%',
          backgroundColor: 'tomato',
        }}
        onClick={onClick}
      />
      {!!selected && renderSuroundingPlayers()}
      {!!selected && renderSuroundingRadius()}
    </>
  )
}

export default Player
