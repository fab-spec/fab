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
    FAB v1.0 Release Candidate 1 has just been released!
    <br />
    Please try it out, and follow <a href="https://twitter.com/fab_spec">@fab_spec</a> on
    Twitter for updates.
  </TopBar>
)
