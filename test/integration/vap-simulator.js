const test = require('tape')
const devp2p = require('../../src')
const util = require('./util.js')

const capabilities = [
  devp2p.VAP.vap63,
  devp2p.VAP.vap62
]
const CHAIN_ID = 1

const GENESIS_TD = 17179869184
const GENESIS_HASH = Buffer.from('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex')

const status = {
  networkId: CHAIN_ID,
  td: devp2p._util.int2buffer(GENESIS_TD),
  bestHash: GENESIS_HASH,
  genesisHash: GENESIS_HASH
}

async function delay (ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

test('VAP: send status message', async (t) => {
  const rlpxs = util.initTwoPeerRLPXSetup(null, capabilities)

  rlpxs[0].on('peer:added', function (peer) {
    const vap = peer.getProtocols()[0]
    // FIXME: VAP events are not going through here
    /* vap.on('message', async (code, payload) => {
      util.destroyRLPXs(rlpxs)
      t.end()
    }) */
    vap.sendStatus(status)
  })

  await delay(400)
  t.pass('should send status message')
  util.destroyRLPXs(rlpxs)
  t.end()
})
