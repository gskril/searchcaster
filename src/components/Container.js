export default function Container({ size, children }) {
  return (
    <>
      <div className="container">{children}</div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: ${size === 'full' ? '100%' : '28rem'};
          padding-left: 1rem;
          padding-right: 1rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}
