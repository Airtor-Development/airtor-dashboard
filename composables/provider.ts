import { BrowserProvider } from 'ethers'
// import { BrowserProvider, getDefaultProvider } from 'ethers'

const NETWORKS = {
  MAINNET: { decimal: 1, hex: '0x1' },
  GOERLI: { decimal: 5, hex: '0x5' }
}

export const useSuggestMetaMask = () => useState<boolean | undefined>(
  'suggest-meta-mask',
  () => false
)

export const suggestMetaMask = useSuggestMetaMask()

export const useProvider = () => {
  if (process.server || typeof window === 'undefined') {
    return null
  } else if (!window.ethereum) {
    suggestMetaMask.value = true
    return null
  } else {
    const provider = new BrowserProvider(
      window.ethereum,
      NETWORKS.GOERLI.decimal
    )

    // @ts-ignore
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      const auth = useAuth()

      if (accounts.length > 0) {
        auth.value = { address: accounts[0] }
      } else {
        auth.value = undefined
      }
    })

    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: NETWORKS.GOERLI.hex
      }]
    })

    return provider
  }
}
