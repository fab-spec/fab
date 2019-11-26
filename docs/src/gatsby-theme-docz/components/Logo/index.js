/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { Link } from 'docz'

import * as styles from 'gatsby-theme-docz/src/components/Logo/styles'

export const Logo = () => {
  return (
    <Flex
      alignItems="center"
      sx={{ ...styles.logo, flexDirection: 'column' }}
      data-testid="logo"
    >
      <Link to="/" sx={styles.link}>
        <img
          sx={{
            width: 200,
          }}
          src="https://user-images.githubusercontent.com/23264/53997145-306ba300-418f-11e9-91d0-b44e6df85d4c.png"
          // src="https://user-images.githubusercontent.com/23264/53997173-49745400-418f-11e9-87d0-60a9da6449e6.png"
        />
      </Link>
    </Flex>
  )
}
