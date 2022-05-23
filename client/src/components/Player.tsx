import { ReactNode, memo, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

type PositionType = {
  x: number
  y: number
}

type PlayerType = PositionType & {
  id: number
}

function createPosition() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  }
}

const radius = 6
const speed = 0.05 // px / second
const positionEmitFrequency = 33
const sprintFrequency = 333
const suroundingRadius = 12

function Player({ player, channel, selected, hidden, onClick }: any) {
  const socket = useMemo(() => io('ws://localhost:5001'), [])
  const [suroundingPlayers, setSuroundingPlayers] = useState<any[]>([])
  const [isSprinting, setIsSprinting] = useState(Math.random() > 0.75)
  const [currentChannel, setCurrentChannel] = useState(-1)
  const [nextChannel, setNextChannel] = useState(0)
  const [actualPlayer, setActualPlayer] = useState<PlayerType>(player)

  const isCurrentChannel = currentChannel === channel

  useEffect(() => () => {
    socket.disconnect()
  }, [socket])

  useEffect(() => {
    socket.on('channel', (channel: number) => {
      if (currentChannel === -1) {
        setCurrentChannel(channel)
      }

      setNextChannel(channel)
    })

    return () => {
      socket.off('channel')
    }
  }, [socket, currentChannel])

  useEffect(() => {
    const { x, y } = actualPlayer

    if ((x < 20 && y < 20) || (x > 100 - 20 && y > 100 - 20)) {
      setCurrentChannel(nextChannel)
    }
  }, [actualPlayer, nextChannel])

  useEffect(() => {
    socket.emit('signin', { email: actualPlayer.id })
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let paused = false
    let currentX = actualPlayer.x
    let currentY = actualPlayer.y
    let objective = createPosition()
    let counter = 0
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
        const vx = (isSprinting ? 2.5 : 1) * speed * dx / distance
        const vy = (isSprinting ? 2.5 : 1) * speed * dy / distance
        currentX += vx
        currentY += vy

        setActualPlayer(x => ({ ...x, x: currentX, y: currentY }))

        if (counter % positionEmitFrequency === 0) {
          counter = 0
          socket.emit('position', {
            x: currentX,
            y: currentY,
            z: 0,
            dx: vx,
            dy: vy,
            dz: 0,
          })
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
      setSuroundingPlayers(players)
    })

    return () => {
      socket.off('players')
    }
  }, [selected, socket])

  function renderSuroundingPlayers() {
    const playerNodes: ReactNode[] = []

    suroundingPlayers.forEach(player => {
      playerNodes.push(
        <SuroundingPlayer
          key={player.id}
          player={player}
        />
      )
    })

    return playerNodes
  }

  function renderSuroundingRadius() {
    return (
      <div
        style={{
          opacity: 0.333,
          position: 'absolute',
          top: `calc(${actualPlayer.y}% - ${suroundingRadius}%)`,
          left: `calc(${actualPlayer.x}% - ${suroundingRadius}%)`,
          width: `${2 * suroundingRadius}%`,
          height: `${2 * suroundingRadius}%`,
          border: '1px solid lightskyblue',
        }}
      />
    )
  }

  function renderChannelChange() {
    return (
      <div
        style={{
          display: isCurrentChannel ? 'block' : 'none',
          opacity: hidden ? 0.333 : 1,
          position: 'absolute',
          top: `calc(${actualPlayer.y}% - ${radius}px - 12px)`,
          left: `calc(${actualPlayer.x}% - ${radius}px + 1.5px)`,
          color: 'tomato',
          fontSize: 8,
        }}
        onClick={onClick}
      >
        {nextChannel}
      </div>
    )
  }

  if (!isCurrentChannel) return null

  return (
    <>
      <div
        style={{
          opacity: hidden ? 0.333 : 1,
          position: 'absolute',
          top: `calc(${actualPlayer.y}% - ${radius}px)`,
          left: `calc(${actualPlayer.x}% - ${radius}px)`,
          width: 2 * radius,
          height: 2 * radius,
          borderRadius: '50%',
          backgroundColor: 'tomato',
        }}
        onClick={onClick}
      />
      {!!selected && renderSuroundingPlayers()}
      {!!selected && renderSuroundingRadius()}
      {currentChannel !== nextChannel && renderChannelChange()}
    </>
  )
}

function SuroundingPlayer({ player }: any) {
  const { x, y, dx, dy } = player
  const [position, setPosition] = useState<PositionType>({ x, y })

  useEffect(() => {
    setPosition({ x, y })

    let paused = false

    function addSpeed() {
      setPosition(p => ({ x: p.x + dx, y: p.y + dy }))

      if (!paused) {
        window.requestAnimationFrame(addSpeed)
      }
    }

    window.requestAnimationFrame(addSpeed)

    return () => {
      paused = true
    }
  }, [x, y, dx, dy])

  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(${position.y}% - ${radius}px)`,
        left: `calc(${position.x}% - ${radius}px)`,
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: '50%',
        backgroundColor: 'lightskyblue',
      }}
    />
  )
}

export default memo(Player)
