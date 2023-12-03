import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ItemInfo from "./ItemInfo";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HowMany from "./HowMany";
export const Items = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage when the component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%", // Ensures the card takes full available height
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    description: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3, // Number of lines before ellipsis
    },
  };
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      console.log(res.data);
      setProducts(res.data);
    });
  }, []);

  const handleClick = (item) => {
    setSelectedProduct(item);
    setOpenModal(!openModal);
  };

  const navigate = useNavigate();

  const convertCurrency = (price) => {
    // Static conversion rate (1 USD = 118 NPR)
    const conversionRate = 118;

    if (!isNaN(price)) {
      const convertedAmount = Math.trunc(parseFloat(price) * conversionRate);
      return convertedAmount;
    }
  };

  const handleAddToCart = (item) => {
    if (userData === null) {
      toast.error("You need to login first.");
      navigate("/login");
    } else {
      //API to add to cart
      setSelectedProduct(item)
      setOpenModal2(!openModal2)
    }
  };

  return (
    <>
      <Box
        sx={{
          padding: 3,
        }}
      >
        <Grid container spacing={2}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ maxWidth: 345 }} style={styles.card}>
                <CardActionArea
                  onClick={() => {
                    handleClick(item);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt="shop"
                  />
                  <CardContent style={styles.cardContent}>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={styles.description}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography gutterBottom variant="h6" component="div">
                    NPR {convertCurrency(item.price)}
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => {
                      handleAddToCart(item);
                    }}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <ItemInfo
          openStatus={openModal}
          setOpenModal={setOpenModal}
          data={selectedProduct}
        />
        <HowMany
          openStatus={openModal2}
          setOpenModal2={setOpenModal2}
          data={selectedProduct}
        />
      </Box>
    </>
  );
};
