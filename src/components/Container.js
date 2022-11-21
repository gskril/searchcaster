export default function Container({ size, children }) {
  const maxWidth = size === 'sm' ? '28rem' : size === 'full' ? '100%' : '38rem'

  return (
    <>
      <div className="container">{children}</div>

      <style jsx>{`
        .container {
          display: flex;
          position: relative;
          flex-direction: column;
          width: 100%;
          max-width: ${maxWidth};
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}
