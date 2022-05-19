import { useState } from 'react'
import { Button, Div, Flex, H1, Section } from 'honorable'

import Player from '../components/Player'

function Home() {
  const [nPlayers, setNPlayers] = useState(0)

  function handleCreate100Players() {
    setNPlayers(x => x + 100)
  }

  const players = []

  for (let i = 0; i < nPlayers; i++) {
    players.push(<Player key={i} />)
  }

  console.log('players', players)

  return (
    <Section
      container
      pt={2}
      pb={4}
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Flex>
        <H1>Localities</H1>
        <Button
          ml={2}
          onClick={handleCreate100Players}
        >
          Create 100 players
        </Button>
      </Flex>
      <Div
        mt={2}
        flexGrow={1}
        border="1px solid border"
        position="relative"
      >
        {players}
      </Div>
    </Section>
  )
}

export default Home
