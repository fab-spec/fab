/** @jsx jsx */
import { useRef, useState } from 'react'
import { jsx, Layout as BaseLayout, Main, Container } from 'theme-ui'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

import { Header } from 'gatsby-theme-docz/src/components/Header'
import { Sidebar } from 'gatsby-theme-docz/src/components/Sidebar'
import * as styles from 'gatsby-theme-docz/src/components/Layout/styles'

const systemFont = css`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
`

const Content = styled.div`
  max-width: 800px;
  padding: 2rem;
  margin: 0 auto;

  h1 {
    ${systemFont};
    margin: 4rem 0 4rem;
    font-size: 3rem;
    font-weight: 300;

    text-align: center;
  }
  h2,
  h3 {
    margin-top: 3rem;
    font-weight: 600;
    font-size: 1.75rem;
  }
  h1,
  h2,
  h3 {
    code {
      font-size: 0.85em;
      font-weight: 400;
    }
  }

  p,
  li {
    line-height: 1.5;
    font-size: 18px;
  }

  p > code,
  p > a > code,
  li > code {
    font-size: 0.85em;
    font-weight: 300;
    white-space: nowrap;
    padding: 0.15em 0.4em;
  }
  p > code,
  li > code {
    background: rgba(255, 239, 213, 0.4);
  }

  pre {
    font-size: 0.9rem;
    background: rgba(255, 239, 213, 0.2) !important;
  }

  pre * {
    font-family: Operator Mono SSm, Inconsolata !important;
    font-weight: 300;
  }
`

const global = css`
  body {
    margin: 0;
    padding: 0;
    font-variant-ligatures: common-ligatures;
    ${systemFont};
  }
  '.icon-link': {
    display: none;
  }
  '.with-overlay': {
    overflow: hidden;
  }
`

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false)
  const nav = useRef()

  return (
    <BaseLayout sx={{ '& > div': { flex: '1 1 auto' } }} data-testid="layout">
      <Global styles={global} />
      <Main sx={styles.main}>
        <Header onOpen={() => setOpen((s) => !s)} />
        <div sx={styles.wrapper}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <Content data-testid="main-container">{children}</Content>
        </div>
      </Main>
    </BaseLayout>
  )
}
