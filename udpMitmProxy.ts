import udp from 'dgram'

// MITM of the local client
let localMitm = udp.createSocket('udp4')
// MITM of the remote client
let remoteMitm = udp.createSocket('udp4')

// Port that receives packets to forward to local client (MITM proxy)
const localMitmPort = 7777

// Local client address and port to forward packets to
const localClientAddress = '127.0.0.1'
const localClientPort = 7888

localMitm.bind(localMitmPort)

// Remote client address and port to forward packets to
// Will be initialized at runtime on first received message (or hardcode it if you know it)
let remoteAddress = ''
let remotePort = -1

const isRemoteInitialized = () => !!remoteAddress && remotePort !== -1

// Always hot-reload the packet handler (`import` cache is not invalidable, yet: https://github.com/nodejs/modules/issues/307)
const requireUncached = (module: string) => {
  delete require.cache[require.resolve(module)]
  return require(module)
}
type PacketHandler = { handleIncomingPacket: (msg: Buffer) => Buffer; handleOutgoingPacket: (msg: Buffer) => Buffer }
const loadPacketHandler = () => requireUncached('./packetHandler') as PacketHandler

const sendToLocalClient = (msg: Buffer) =>
  remoteMitm.send(loadPacketHandler().handleIncomingPacket(msg), localClientPort, localClientAddress)
const sendToRemoteClient = (msg: Buffer) =>
  localMitm.send(loadPacketHandler().handleOutgoingPacket(msg), remotePort, remoteAddress)

// Kill sockets on error
;[remoteMitm, localMitm].forEach(x =>
  x.on('error', error => {
    console.log('Error: ' + error)
    remoteMitm.close()
    localMitm.close()
  })
)

localMitm.on('listening', () => {
  const address = localMitm.address()
  console.log(`Server is listening on port: ${address.port}`)
  console.log(`Server ip:                   ${address.address}`)
  console.log(`Server is IPv4/IPv6:         ${address.family}`)
})

localMitm.on('message', (msg, info) => {
  if (!isRemoteInitialized()) {
    remoteAddress = info.address
    remotePort = info.port
  }
  sendToLocalClient(msg)
})

remoteMitm.on('message', (msg, info) => sendToRemoteClient(msg))
