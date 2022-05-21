import { ReactNode, useEffect, useState } from 'react'
import { Button, Div, Flex, H1, P, Section, Slider, Switch } from 'honorable'

import Player from '../components/Player'

type PlayerType = {
  id: number
  x: number
  y: number
}

function Home() {
  const [channel, setChannel] = useState(0)
  const [nPlayers, setNPlayers] = useState(32)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [curentPlayerId, setCurrentPlayerId] = useState(-1)
  const [isRandomized, setIsRandomized] = useState(true)

  const hasPlayers = players.length > 0

  useEffect(() => {
    if (!(isRandomized && hasPlayers)) return

    const intervalId = setInterval(() => {
      if (Math.random() >= 0.5) {
        setPlayers(x => [...x, { id: Math.random(), x: Math.random() * 100, y: Math.random() * 100 }])
      }
      else {
        setPlayers(x => {
          const index = Math.floor(Math.random() * x.length)

          return [...x.slice(0, index), ...x.slice(index + 1)]
        })
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isRandomized, hasPlayers])

  function handleCreatePlayers() {
    let i = 0

    const intervalId = setInterval(() => {
      i++

      setPlayers(x => [
        ...x,
        {
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      ])

      if (i === nPlayers) {
        clearInterval(intervalId)
      }
    }, 250)
  }

  function renderCorners() {
    return (
      <>
        <Div
          position="absolute"
          top={0}
          left={0}
          width={0}
          height={0}
          borderTop="300px solid transparency(palegreen, 50)"
          borderRight="300px solid transparent"
        />
        <Div
          position="absolute"
          bottom={0}
          right={0}
          width={0}
          height={0}
          borderBottom="300px solid transparency(palegreen, 50)"
          borderLeft="300px solid transparent"
        />
      </>
    )
  }

  function renderPlayers() {
    const playerNodes: ReactNode[] = []

    players.forEach(player => {
      playerNodes.push(
        <Player
          key={player.id}
          player={player}
          channel={channel}
          hidden={curentPlayerId > -1 && player.id !== curentPlayerId}
          selected={curentPlayerId === player.id}
          onClick={() => setCurrentPlayerId(curentPlayerId === player.id ? -1 : player.id)}
        />
      )
    })

    return playerNodes
  }

  return (
    <Section
      container
      pt={2}
      pb={4}
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Flex align="center">
        <H1>Localities</H1>
        <Slider
          ml={2}
          min={1}
          max={100}
          step={1}
          value={nPlayers}
          onChange={(event, value) => setNPlayers(value)}
        />
        <Button
          ml={1}
          onClick={handleCreatePlayers}
        >
          Create {nPlayers} players
        </Button>
        <Switch
          ml={1}
          checked={isRandomized}
          onChange={event => setIsRandomized(!!event.target.checked)}
        />
        <P ml={0.5}>
          {isRandomized ? 'Randomized' : 'Not randomized'}
        </P>
      </Flex>
      <Flex
        mt={1}
        align="center"
      >
        <Button
          onClick={() => setChannel(x => Math.max(0, x - 1))}
        >
          -
        </Button>
        <Button
          ml={0.5}
          onClick={() => setChannel(x => x + 1)}
        >
          +
        </Button>
        <P ml={0.5}>Channel {channel}</P>
      </Flex>
      <Div
        mt={1}
        flexGrow={1}
        border="1px solid border"
        position="relative"
      >
        {renderCorners()}
        {renderPlayers()}
      </Div>
    </Section>
  )
}

export default Home
