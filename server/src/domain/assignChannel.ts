import db from '../db'

import { PlayerModel } from '../db/models/Player'

import { maxPlayersPerChannel } from '../configuration'

async function assignChannel(player: PlayerModel) {
  let channel = 0

  while (true) {
    const n = await db.Player.count({ where: { connected: true, channel } })

    console.log('channel, n', channel, n)
    if (n < maxPlayersPerChannel) return channel

    channel++
  }
}

export default assignChannel
