import { SuiJsonRpcClient as SuiClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc"

let mainnetClient: SuiClient | null = null
let testnetClient: SuiClient | null = null

export function getSuiClient(network: "mainnet" | "testnet" = "mainnet"): SuiClient {
  if (network === "testnet") {
    if (!testnetClient) {
      testnetClient = new SuiClient({
        url: getJsonRpcFullnodeUrl("testnet"),
        network: "testnet"
      })
    }
    return testnetClient
  }

  if (!mainnetClient) {
    mainnetClient = new SuiClient({
      url: getJsonRpcFullnodeUrl("mainnet"),
      network: "mainnet"
    })
  }
  return mainnetClient
}

