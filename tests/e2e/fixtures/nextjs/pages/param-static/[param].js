import React from 'react'

export default (props) => {
  return (
    <div>
      <h1>Static page, dynamic route.</h1>
      <pre>
        { JSON.stringify(props, null, 2) }
      </pre>
    </div>
  )
}
