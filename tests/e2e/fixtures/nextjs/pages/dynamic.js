import React from 'react'
import Head from 'next/head'
import fetch from 'cross-fetch'

const Dynamic = (props) => (
  <div>
    <Head>
      <title>NextJS & FAB demo</title>
    </Head>

    <div className="hero">
      <img
        src="https://user-images.githubusercontent.com/23264/53997145-306ba300-418f-11e9-91d0-b44e6df85d4c.png"
        alt=""
      />
      <h1 className="title">Next.js running in a FAB!</h1>
      <p className="description">
        This page was rendered on the server with a random number of {props.rando}
      </p>
      <p className="description">
        Server-side rendered from{' '}
        <strong>
          {props.city} in {props.regionName}, {props.country}
        </strong>
      </p>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .hero > img {
        display: block;
        margin: 0 auto;
        max-width: 260px;
        margin-top: 60px;
      }
      .title {
        margin: 0;
        width: 100%;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
)

Dynamic.getInitialProps = async () => {
  const geo = { city: 'dunno', regionName: 'no idea', country: 'nup, not even that' }
  try {
    await Promise.race([
      new Promise((res) => setTimeout(res, 1000)),
      fetch('http://ip-api.com/json')
        .then((r) => r.json())
        .then((json) => Object.assign(geo, json)),
    ])
  } catch (e) {}
  return { rando: Math.random(), ...geo }
}

export default Dynamic
