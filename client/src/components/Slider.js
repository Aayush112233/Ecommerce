import { Box } from "@mui/material";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const Slider = () => {
  return (
    <>
      <Box sx={{
        width:"70%",
        margin:"auto",
        pt:2
      }}>
        <Carousel autoPlay>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/868824de-812d-42a1-8475-9bbbd64b2bf8.png_1200x1200.jpg"
            />
          </div>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/624f2c0f-b929-4ea7-a93a-cca8a9c411d3.jpg"
            />
          </div>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/f72ec293-03dd-4db9-889f-87181c609521.jpg"
            />
          </div>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/656988de-9d8f-492b-983a-f5d4be99b86f.jpg"
            />
          </div>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/764bf1e0-1643-474a-b707-b1fd1b12906b.jpg"
            />
          </div>
          <div>
            <img
              alt=""
              src="https://icms-image.slatic.net/images/ims-web/d58fb4c0-4bbe-4aea-9557-0e7fd4fea276.jpg"
            />
          </div>
        </Carousel>
      </Box>
    </>
  );
};
