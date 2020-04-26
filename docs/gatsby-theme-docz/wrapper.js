import * as React from 'react'
import { Helmet } from 'react-helmet-async'

const Wrapper = ({ children }) => (
  <React.Fragment>
    <Helmet>
      <link rel="icon" type="image/png" href="/public/favicon-32x32.png" />
      <script
        data-goatcounter="https://fab.goatcounter.com/count"
        async
        src="https://gc.zgo.at/count.js"
      />
    </Helmet>
    {children}
  </React.Fragment>
)
export default Wrapper
