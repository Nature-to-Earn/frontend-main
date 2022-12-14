import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  Flex,
  Box,
  Heading,
  Spacer,
  Button,
  Center,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import Image from "next/image";
import logo from "./logo/logo.png";
import contract_config from "./contractData/contractConfig";
// import styles from "./css/index.module.css";
// import Register from "./components/Register";
import dynamic from "next/dynamic";
// import Dao from "./Dao";
const Register = dynamic(() => import("./Register"), { ssr: false });
const Dao = dynamic(() => import("./Dao"), { ssr: false });
const BookEvent = dynamic(() => import("./BookEvent"), { ssr: false });
const Host = dynamic(() => import("./Host"), { ssr: false });
const Proof = dynamic(() => import("./Proof"), { ssr: false });
const NFT = dynamic(() => import("./NFT"), { ssr: false });

function App() {
  const { address, isConnected } = useAccount();

  return (
    <Box
      bgGradient="linear(to-r, blue.200, white.500)"
      // className={styles.container}
      paddingBottom="18px"
      paddingRight="18px"
      paddingLeft="18px"
      _dark
    >
      <Flex
        justifyContent="space-between"
        marginBottom="10"
        borderBottom="3px"
        borderColor="black"
      >
        <Box margin="10px 10px">
          <Image src={logo} width="175px" height="175px" />
        </Box>
        {/* <Spacer /> */}
        <Heading textAlign="center" fontSize="6xl" m={(20, 10)}>
          Nature2earn
        </Heading>
        <Box margin="1rem">
          <ConnectButton />
        </Box>
      </Flex>
      <Tabs size="lg" colorScheme="purple" align="center" variant="enclosed">
        <TabList>
          <Tab fontWeight="bold">Home</Tab>
          <Tab fontWeight="bold">Events</Tab>
          <Tab fontWeight="bold">DAO</Tab>
          <Tab fontWeight="bold">Host</Tab>
          <Tab fontWeight="bold">Submit proof</Tab>
          <Tab fontWeight="bold">Mint NFT</Tab>
          {/* <Tab fontWeight="bold</Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Heading marginTop="4rem" fontFamily="cursive">
              Rewarding people for connecting with nature
            </Heading>
            <Text width="70%" marginTop="4rem">
              Nature-to-Earn (N2E) is a purpose-driven token that rewards people
              for getting out into nature. We believe that connecting with
              nature pushes people to take better care of nature. By having N2E
              validators facilitate nature events (e.g. hikes, mushroom forays,
              beach cleanups, etc), we can verify people's participation in
              nature events & reward them accordingly{" "}
            </Text>
          </TabPanel>
          <TabPanel>
            <Register user={address} />
          </TabPanel>
          <TabPanel>
            <Dao user={address}></Dao>
          </TabPanel>
          <TabPanel>
            <Host user={address}></Host>
          </TabPanel>
          <TabPanel>
            <Proof user={address}></Proof>
          </TabPanel>
          <TabPanel>
            <NFT user={address}></NFT>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;
