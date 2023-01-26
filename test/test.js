const ETHToken = artifacts.require("./TokenEth.sol")
const ETHBridge = artifacts.require("./BridgeEth.sol")

const BSCBridge = artifacts.require("./BridgeBsc.sol")
const BSCToken = artifacts.require("./TokenBsc.sol")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Bridge', ([deployer, user]) => {

    let ethToken, ethBridge, bscToken, bscBridge, result

    beforeEach(async () => {
        ethToken = ETHToken
        ethBridge = ETHBridge

        await ethToken.mint(deployer, '1000')
        await ethToken.setBridge(ethBridge.address)

        bscToken = await BSCToken
        bscBridge = await BSCBridge

        await bscToken.setBridge(bscBridge.address)
    })

    describe('Deployment', () => {
        it('Returns the associated token address', async () => {
            result = await ethBridge.token()
            result.should.equal(ethToken.address)

            result = await bscBridge.token()
            result.should.equal(bscToken.address)
        })
    })

    describe('Burning', () => {
        const amountToBurn = 500

        beforeEach(async () => {
            result = await ethBridge.burn(deployer, amountToBurn, [], { from: deployer })
        })

        it('successfully burns our tokens', async () => {
            const balance = await ethToken.balanceOf(deployer)
            balance.toString().should.equal(amountToBurn.toString()) // 1000 - 500 = 500
        })

        it('successfully emits event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Transfer')

            const event = log.args

            event.from.should.equal(deployer)
            event.amount.toString().should.equal(amountToBurn.toString())
            event.step.toString().should.equal('0')
        })
    })
})