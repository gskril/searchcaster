import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function ConnectMessage() {
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <p>Connect a wallet to use this website.</p>
      <p>
        It doesn&apos;t matter what&apos;s in the wallet. We just don&apos;t
        care to have crypto haters here. So either install a crypto wallet or
        carry on with your day :&#41;
      </p>
      <button onClick={openConnectModal}>Connect Wallet</button>
    </>
  )
}
