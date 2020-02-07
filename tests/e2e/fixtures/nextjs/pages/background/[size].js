import React from 'react'
import Head from 'next/head'
import Nav from '../../components/nav'

const Bill = ({ size }) => (
  <div>
    <Head>
      <title>NextJS & FAB demo</title>
    </Head>

    <Nav />

    <div className="background">
      Rendered with a background of size ${size}
    </div>

    <style jsx>{`
      .background {
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: url('https://www.fillmurray.com/${size}/${size}');
      }
    `}</style>
  </div>
)

Bill.getInitialProps = ({query}) => {
  return { size: query.size }
}

export default Bill
