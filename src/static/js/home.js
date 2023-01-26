let TokenEthAbi, TokenBscAbi, BridgeEthAbi, BridgeBscAbi
let TokenContract, BridgeContract
let networkName = 'ethTestnet'

let isConnect = false

async function initWeb3() {
    await loadWeb3();
    TokenEthAbi = await onGetAbi("TokenEth");
    TokenBscAbi = await onGetAbi("TokenBSC");
    BridgeEthAbi = await onGetAbi("BridgeETh");
    BridgeBscAbi = await onGetAbi("BridgeBsc");
    await loadBlockchainData();
    updateTitle()
    onGetBalance()
    onInitSelect()
}

document.querySelector('#mintButton').addEventListener('click', async (e) => {
    e.preventDefault()
    mintToken()
})

document.querySelector('#bridgeButton').addEventListener('click', async (e) => {
    e.preventDefault()
    bridgeToken()
})

const updateTitle = () => {
    if (networkName === 'ethTestnet') {
        document.querySelector('#title').innerHTML = 'You are on worng network please select bscTestnet or Goerli.'
    } else {
        document.querySelector('#title').innerHTML = 'You are on ' + networkName + '.'
    }
}

const onInitSelect = async () => {
    const bridgeSelecter = document.querySelector('#bridgeNetwork')
    if(networkName === 'ethTestnet'){
        bridgeSelecter.innerHTML = `
        <option selected value="bscTestnet">bscTestnet</option>
        `
    }else {
        bridgeSelecter.innerHTML = `
        <option selected value="ethTestnet">ethTestnet</option>
        `
    }
}

const onGetBalance = async () => {
    const accounts = await web3.eth.getAccounts();
    const getBalanceTransaction = await TokenContract.methods.balanceOf(accounts[0]).call()
    const balance = web3.utils.fromWei(getBalanceTransaction, 'ether');

    document.querySelector('#totalBalance').innerHTML = balance + ' Token'

}

const mintToken = async () => {
    const accounts = await web3.eth.getAccounts();
    const address = document.querySelector('#mintAddress').value
    let amount = document.querySelector('#mintBalance').value
    amount = web3.utils.toWei(amount, 'ether');
    

    let mintTransaction = await TokenContract.methods.mint(address, amount).send({ from: accounts[0] }).on('transactionHash', (hash) => {
        console.log('mintTransaction')
    })

    console.log(mintTransaction.events.Transfer.returnValues)
}

const bridgeToken = async () => {
    const accounts = await web3.eth.getAccounts();
    let amount = document.querySelector('#bridgeBalance').value
    amount = web3.utils.toWei(amount, 'ether');


    let bridgeContractTransaction = await BridgeContract.methods.burn(accounts[0], amount).send({ from: accounts[0] }).on('transactionHash', (hash) => {
        console.log('bridgeContractTransaction')
    })

    console.log('bridgeContractTransaction : ', bridgeContractTransaction)
}