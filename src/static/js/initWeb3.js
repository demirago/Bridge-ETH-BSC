let NFTMarketAbi, NFTAbi;

let NFTMarketContract, NFTContract, networkId;

async function onGetAbi(contractName) {
  let response = await fetch(`/build/contracts/${contractName}.json`, {
    method: "GET",
  });
  let result = await response.json();
  return result;
}

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert("Non-Ethereum browser detected.");
  }
}

async function loadBlockchainData() {
  const web3 = window.web3;

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // NetWork ID
  // get network id form metamask that we are useing
  networkId = await web3.eth.net.getId();
  // get network data form json abi file by networkId
  const TokenEthAbiNetworkData = TokenEthAbi.networks[networkId];
  const BridgeEthAbiNetworkData = BridgeEthAbi.networks[networkId]
  
  const BridgeBscAbiNetworkData = BridgeBscAbi.networks[networkId]
  const TokenBscAbiNetworkData = TokenBscAbi.networks[networkId];

  // check network
  if (TokenEthAbiNetworkData && BridgeEthAbiNetworkData) {
    networkName = 'ethTestnet'

    TokenContract = await connectToBlockchain(TokenEthAbi.abi, TokenEthAbiNetworkData.address)
    BridgeContract = await connectToBlockchain(BridgeEthAbi.abi, BridgeEthAbiNetworkData.address)

    console.log('TokenEthContract : ', TokenContract)

    isConnect = true
  } else if (TokenBscAbiNetworkData && TokenBscAbiNetworkData) {
    networkName = 'bscTestnet'

    TokenContract = await connectToBlockchain(TokenBscAbi.abi, TokenBscAbiNetworkData.address)
    BridgeContract = await connectToBlockchain(BridgeBscAbi.abi, BridgeBscAbiNetworkData.address)


    console.log('TokenBscContract : ', TokenContract)

    isConnect = true
  } else {
    window.alert("You are on worng network please select bscTestnet or ethTestnet.");
    isConnect = false
  }

}

const connectToBlockchain = async (abi, networkData) => {
  const instance = await new web3.eth.Contract(
    abi,
    networkData
  )

  return instance
}