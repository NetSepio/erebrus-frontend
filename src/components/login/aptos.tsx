"use client"

import { useWallet } from "@aptos-labs/wallet-adapter-react"
import Cookies from "js-cookie"
import axios from "axios"
import { useEffect, useState } from "react"

export const useAptosWallet = () => {
  const { account, connected, network, signMessage, connect } = useWallet()
  const [networkName, setNetworkName] = useState<string | undefined>(undefined)

  // Get the expected network from environment or default to testnet
  const expectedNetwork = process.env.NEXT_PUBLIC_NETWORK_APTOS || "testnet"

  useEffect(() => {
    if (network) {
      setNetworkName(network.name?.toLowerCase())
    }
  }, [network])

  // Debug logs
  useEffect(() => {
    console.log("Aptos wallet status:", {
      connected,
      networkName,
      expectedNetwork,
      account: account?.address,
    })
  }, [connected, networkName, account])

  const isSendableNetwork = () => {
    // If not connected, can't send
    if (!connected) return false

    // If network name is undefined, we can't verify
    if (!networkName) return false

    // Check if current network matches expected network
    return networkName === expectedNetwork.toLowerCase()
  }

  const sendableApt = isSendableNetwork()

  const connectWallet = async () => {
    try {
      await connect("petra")
      return true
    } catch (error) {
      console.error("Failed to connect Aptos wallet:", error)
      return false
    }
  }

  const onSignMessage = async (setShowSignButtonCallback: ((show: boolean) => void) | null = null) => {
    // Check if already authenticated
    const checktoken = Cookies.get("erebrus_token")
    const checkwallet = Cookies.get("erebrus_wallet")
    const checkuserId = Cookies.get("erebrus_userid")

    if (checktoken && checkwallet && checkuserId) {
      console.log("User already authenticated")
      return
    }

    if (!connected) {
      const connected = await connectWallet()
      if (!connected) {
        alert("Please connect your Aptos wallet first")
        return
      }
    }

    if (!sendableApt) {
      alert(`Please switch to ${expectedNetwork} in your Aptos wallet`)
      return
    }

    try {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

      const { data } = await axios.get(
        `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account?.address}&chain=aptos`,
      )

      if (!data || !data.payload) {
        throw new Error("Invalid response from server")
      }

      const message = data.payload.eula
      const nonce = data.payload.flowId
      const publicKey = account?.publicKey

      if (!publicKey) {
        throw new Error("Public key not available")
      }

      const payload = {
        message: message,
        nonce: nonce,
      }

      console.log("Signing message:", payload)
      const response = await signMessage(payload)
      console.log("Sign response:", response)

      let signaturewallet = Array.isArray(response.signature) ? response.signature.join("") : String(response.signature)

      if (signaturewallet.length === 128) {
        signaturewallet = `0x${signaturewallet}`
      }

      const authenticationData = {
        flowId: nonce,
        signature: `${signaturewallet}`,
        pubKey: publicKey,
        walletAddress: account?.address,
        message: message,
        chainName: "aptos",
      }

      console.log("Auth data:", authenticationData)

      const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?walletAddress=${account?.address}&chain=aptos`

      const config = {
        url: authenticateApiUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: authenticationData,
      }

      const authResponse = await axios(config)
      console.log("Auth response:", authResponse)

      if (!authResponse?.data?.payload?.token) {
        throw new Error("Authentication failed - no token received")
      }

      const token = authResponse?.data?.payload?.token
      const userId = authResponse?.data?.payload?.userId

      Cookies.set("erebrus_token", token, { expires: 7 })
      Cookies.set("erebrus_wallet", String(account?.address ?? ""), { expires: 7 })
      Cookies.set("erebrus_userid", userId, { expires: 7 })
      Cookies.set("Chain_symbol", "aptos", { expires: 7 })

      window.location.reload()
    } catch (error) {
      console.error("Aptos sign-in error:", error)
      alert(`Error signing in with Aptos: ${"Unknown error"}`)
      if (setShowSignButtonCallback) {
        setShowSignButtonCallback?.(true)
      }
    }
  }

  return { account, connected, network, onSignMessage, connectWallet }
}
