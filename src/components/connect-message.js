import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function ConnectMessage() {
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <p>
        Connect a wallet to use this website. It doesn&apos;t matter what&apos;s
        inside.
      </p>
      <button onClick={openConnectModal}>Connect Wallet</button>
    </>
  )
}
