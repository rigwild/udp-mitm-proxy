# UDP MITM proxy

A simple UDP MITM proxy without any dependencies (only TypeScript) and hot-reload support.

**Note:** This is a custom development/game hacking/debugging tool, not a npm module.

## Install

```
git clone https://github.com/rigwild/udp-mitm-proxy
cd udp-mitm-proxy
yarn
```

## Usage

Handle incoming and outgoing packets in [`./packetHandler.ts`](./packetHandler.ts). This file is always hot-reloaded. You don't need to restart the proxy everytime you edit the handler.

If you use [ts-node](https://github.com/TypeStrong/ts-node), you will only need to save the packet handler's file, no need to recompile using `tsc`.

Start the proxy.

```
ts-node udpMitmProxy.ts
```

## How it works

The proxy listens on port 7777. It waits for an unknown remote client (B) to send a UDP packet to it. The remote address/port are then registered by the proxy for future local (A) to remote (B) packet sending.

Received and sent packets are passed to the corresponding [packet handler](./packetHandler.ts), which can edit its content before being forwarded.

Received packets are forwarded to local port 7888.\
Sent packets are forwarded to previously registered remote address/port.

![Proxy diagram](./diagram.png)

If you know the remote client's address and port, you may hardcode it in the proxy instead.

**Note:** The proxy will not work if the remote client (B) does not send a UDP packet **first** as it will not know the remote address/port to use. Hardcode these values instead if the local client (A) might send a packet first.

## Notice

I wrote this simple tool for game hacking and CTFs. I will not actively maintain it, nor make it a npm module.

Feel free to send Pull Requests to fix something, or fork it for your own custom usage.

## License

[The MIT license](./LICENSE)
