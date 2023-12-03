import React from "react";
import NavigationBar from "../components/NavigationBar.js";
import { Slider } from "../components/Slider.js";
import { Items } from "../components/Items.js";
import { Toolbar } from "@mui/material";

export const LandingPage = () => {
  return (
    <>
      <NavigationBar />
      <Toolbar />
      <Slider />
      <Items />
    </>
  );
};
