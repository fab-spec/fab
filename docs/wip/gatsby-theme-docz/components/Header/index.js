import React from 'react'
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
    FAB v1.0 RC1 has just been released, please try it out!
    <br />
    Then, follow <a href="https://twitter.com/fab_spec">@fab_spec</a> on Twitter for
    updates.
  </TopBar>
)
