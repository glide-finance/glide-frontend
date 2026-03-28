import { AbstractConnector } from '@web3-react/abstract-connector'
import type { ConnectorUpdate } from '@web3-react/types'
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider'

type EthereumProvider = import('@walletconnect/ethereum-provider').default

export class WalletConnectV2Connector extends AbstractConnector {
  private provider?: EthereumProvider

  private readonly config: EthereumProviderOptions

  constructor(config: EthereumProviderOptions) {
    super({ supportedChainIds: [...(config.chains ?? []), ...(config.optionalChains ?? [])] })
    this.config = config
  }

  private handleChainChanged = (chainId: number | string): void => {
    this.emitUpdate({ chainId: Number(chainId) })
  }

  private handleAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleDisconnect = (): void => {
    this.provider = undefined
    this.emitDeactivate()
  }

  async activate(): Promise<ConnectorUpdate> {
    const { default: EthereumProvider } = await import('@walletconnect/ethereum-provider')

    this.provider = await EthereumProvider.init(this.config)

    this.provider.on('chainChanged', this.handleChainChanged)
    this.provider.on('accountsChanged', this.handleAccountsChanged)
    this.provider.on('disconnect', this.handleDisconnect)

    const accounts = await this.provider.enable()

    return {
      provider: this.provider,
      chainId: this.provider.chainId,
      account: accounts[0],
    }
  }

  async getProvider(): Promise<EthereumProvider | undefined> {
    return this.provider
  }

  async getChainId(): Promise<number> {
    if (!this.provider) throw new Error('WalletConnect provider not initialized')
    return this.provider.chainId
  }

  async getAccount(): Promise<string> {
    if (!this.provider) throw new Error('WalletConnect provider not initialized')
    return this.provider.accounts[0]
  }

  deactivate(): void {
    if (this.provider) {
      this.provider.removeListener('chainChanged', this.handleChainChanged)
      this.provider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.provider.removeListener('disconnect', this.handleDisconnect)
    }
  }

  async close(): Promise<void> {
    if (this.provider) {
      await this.provider.disconnect()
    }
    this.emitDeactivate()
  }
}
