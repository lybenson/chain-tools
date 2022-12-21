import '@rainbow-me/rainbowkit/styles.css';


import { ConnectButton } from '@rainbow-me/rainbowkit';

import { Box, Button, Flex } from "@chakra-ui/react"
export default function Header () {
  return (
    <Box width='100vw' height='80px' background='gray' position='fixed' top='0'>
      <Flex alignItems='center' justify='flex-end' height='100%'>
        <ConnectButton></ConnectButton>
      </Flex>
    </Box>
  )
}
