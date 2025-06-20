export function Banner() {
  return (
    <div className="banner">
      <p>
        Searchcaster has been deprecated. Try{' '}
        <a href="https://buoy.club">Buoy</a> instead.
      </p>

      <style jsx>{`
        .banner {
          background-color: var(--bg-color);
          padding: 0.5rem;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
