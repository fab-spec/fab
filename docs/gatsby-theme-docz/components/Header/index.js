import React, { useRef, useEffect } from 'react'
import styled from '@emotion/styled'

const TopBar = styled.div`
  background-color: #195dc6;
  color: white;
  font-size: 0.9rem;
  padding: 0.67rem 2rem;
  line-height: 1.2;
  text-align: center;

  > a {
    color: inherit;
  }
`

export const Header = () => (
  <TopBar>
    The FAB project is gearing up for a v1.0 release in the next few days. This
    documentation may be in flux.
    <br />
    Follow <a href="https://twitter.com/fab_spec">@fab_spec</a> on Twitter for updates.
  </TopBar>
)
