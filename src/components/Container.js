export default function Container({ size, children }) {
  const maxWidth = size === 'sm' ? '28rem' : size === 'full' ? '100%' : '32rem'

  return (
    <>
      <div className="container">{children}</div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: ${maxWidth};
          padding-left: 1rem;
          padding-right: 1rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}
