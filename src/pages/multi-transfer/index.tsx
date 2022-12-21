import { Box } from "@chakra-ui/react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";
import Confirm from "./Confirm";
import Ready from "./Ready";
import Transfer from "./Transfer";

export default function MultiTransfer () {

  return (
    <Box pt='200px'>
      <Ready />
    </Box>
  )
}
