const getTokenLogoURL = (address: string) =>
  // `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
  `/images/tokens/${address}.svg`

export default getTokenLogoURL
