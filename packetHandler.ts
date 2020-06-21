export const handleIncomingPacket = (msg: Buffer): Buffer => {
  console.log(`<-- ${msg.toString('hex')}`)
  return msg
}

export const handleOutgoingPacket = (msg: Buffer): Buffer => {
  console.log(`--> ${msg.toString('hex')}`)
  return msg
}
