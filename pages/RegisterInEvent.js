import React, { useState } from "react";
import Link from "next/link";

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
  Input,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import contract_config from "./contractData/contractConfig";
import { File } from "web3.storage";
import makeStorageClient from "./components/storageClient";
import {
  useProvider,
  useContract,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { useRouter } from "next/router";
import { WidgetProps } from "@worldcoin/id";
const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
  { ssr: false }
);

function RegisterInEvent() {
  const [formState, setFormState] = useState({
    eventId: 0,
    fullName: "",
    age: 0,
    country: "",
    cid: "",
  });
  const [worldCoinData, setWorldCoinData] = useState();

  const { data: isNotEligible } = useContractRead({
    ...contract_config,
    functionName: "verify",
    args: [formState.eventId, worldCoinData?.nullifierHash],
  });

  const { config2 } = usePrepareContractWrite({
    ...contract_config,
    functionName: "registerForEvent",
    args: [
      formState.eventId,
      formState.cid,
      worldCoinData?.input,
      worldCoinData?.root,
      worldCoinData?.nullifierHash,
    ],
  });

  const { config } = usePrepareContractWrite({
    ...contract_config,
    functionName: "registerForEvent_withoutWorldcoin",
    args: [+formState.eventId, formState.cid],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  // const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const widgetProps = {
    actionId: "wid_staging_96b3a182076c8e6f6153114b4531cfb9",
    signal: "user-id-1",
    enableTelemetry: true,
    appName: "testing n2e",
    signalDescription: "Get your ticket to n2e 2023",
    theme: "dark",
    debug: true, // Recommended **only** for development
    onSuccess: (result) => {
      console.log(result);
      setWorldCoinData(result);
    },
    onError: ({ code, detail }) => console.log({ code, detail }),
    onInitSuccess: () => console.log("Init successful"),
    onInitError: (error) =>
      console.log("Error while initialization World ID", error),
  };

  const getImageLink = async () => {
    // get file
    const file = document.querySelector('input[type="file"]');

    // upload file
    const client = makeStorageClient();
    const cid = await client.put(file.files);

    // construct file url and return
    const imageUri = `https://${cid}.ipfs.dweb.link/${file.files[0].name}`;

    return imageUri;
  };

  const generateData = async () => {
    const imageUri = await getImageLink();

    const metadata = {
      name: formState.fullName,
      image: imageUri,
      country: formState.country,
      age: formState.age,
    };
    // console.log(metadata);
    return metadata;
  };
  const makeFile = async () => {
    const obj = await generateData();
    const blob = Buffer.from(JSON.stringify(obj));

    const file = [new File([blob], "user_info.json")];

    return file;
  };

  const storeData = async () => {
    const client = makeStorageClient();
    const file = await makeFile();

    const _cid = await client.put(file);
    const cidLink = `https://${_cid}.ipfs.dweb.link/user_info.json`;

    return cidLink;
  };

  const formChangeHandler = (e) => {
    if (e.target.name == "fullName") {
      setFormState({ ...formState, fullName: e.target.value });
      // console.log(e.target.value);
      // console.log(formState);
    } else if (e.target.name == "age") {
      setFormState({ ...formState, age: +e.target.value });
    } else if (e.target.name == "country") {
      setFormState({ ...formState, country: e.target.value });
    } else {
      setFormState({ ...formState, eventId: +e.target.value });
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(formState);
    const _cid = await storeData();
    setFormState({ ...formState, cid: _cid });
    console.log(formState);
    console.log(_cid);
    // console.log(worldCoinData);
    write?.();
    // console.log(worldCoinData);

    //If worldcoin starts working uncomment this and remove next call.

    // if (isNotEligible) {
    //   <Alert status="error">
    //     <AlertIcon />
    //     <AlertTitle>You cannot register a slot in this event</AlertTitle>
    //     <AlertDescription>
    //       Looks like you already booked a slot in this event
    //     </AlertDescription>
    //   </Alert>;
    // }else{

    // }

    /*

    TODO :- 
    1.upload the picture to ipfs
    2.upload the metadata file(consisting name,age,country and picture ipfs link) to ipfs.
    3. call the SC function "registerForEvent" with the ipfs link returned from step 2.

    */
  };

  // return <WorldIDWidget {...widgetProps} />

  return (
    <Flex marginTop="8rem" justifyContent="center" alignItems="center">
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Box margin="1rem">
          <WorldIDWidget {...widgetProps} />
        </Box>
        <form onSubmit={submitHandler} marginTop="2rem">
          <FormControl>
            <FormLabel>Event id</FormLabel>
            <Input type="number" name="eventId" onChange={formChangeHandler} />
          </FormControl>
          <FormControl>
            <FormLabel>name</FormLabel>
            <Input type="text" name="fullName" onChange={formChangeHandler} />
          </FormControl>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Select
              placeholder="Select country"
              name="country"
              onChange={formChangeHandler}
            >
              <option>United Arab Emirates</option>
              <option>Nigeria</option>
              <option>India</option>
              <option>France</option>
              <option>United Kingdom</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>age</FormLabel>
            <Input type="number" name="age" onChange={formChangeHandler} />
          </FormControl>
          <FormControl>
            <FormLabel>Picture</FormLabel>
            <Input type="file" />
          </FormControl>
          <Button m="20px" type="submit">
            {/* <Link href="/"> */}
            <a>Submit</a>
            {/* </Link> */}
          </Button>
        </form>
      </Flex>
    </Flex>
  );
}

export default RegisterInEvent;
