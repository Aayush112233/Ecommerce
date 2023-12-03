import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import { Divider, IconButton, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CartModal({ openStatus, setOpenStatus }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpenStatus(false);

  const [products, setProducts] = React.useState([]);
  const [userData, setUserData] = React.useState(null);

  const [isCheckout, setIsCheckout] = React.useState(false);

  React.useEffect(() => {
    // Fetch user data from local storage when the component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const convertCurrency = (price) => {
    // Static conversion rate (1 USD = 118 NPR)
    const conversionRate = 118;

    if (!isNaN(price)) {
      const convertedAmount = Math.trunc(parseFloat(price) * conversionRate);
      return convertedAmount;
    }
  };

  React.useEffect(() => {
    if (userData && openStatus) {
      getAllOrder();
    }
  }, [userData, openStatus]);

  const getAllOrder = () => {
    axios
      .get(`http://localhost:9000/user-orders/${userData.id}`)
      .then((res) => {
        setProducts(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (user, product) => {
    axios
      .delete(`http://localhost:9000/remove-from-cart/${user}/${product}`)
      .then((res) => {
        toast.success("Order removed successfully");
        getAllOrder();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckout = () => {
    axios
      .delete(`http://localhost:9000/checkout-from-cart/${userData.id}`)
      .then((res) => {
        toast.success("Your order has been placed. We will contact you soon.");
        setOpenStatus(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateTotal = () => {
    if (!products || products.length === 0) {
      return 0; // Return 0 if products array is empty or undefined
    }

    const totalPrice = products.reduce((total, item) => {
      const productTotal = item.product.price * item.number;
      return total + productTotal;
    }, 0);

    return totalPrice;
  };

  console.log(products);

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={openStatus}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={openStatus}>
          <Box sx={style}>
            <Typography id="spring-modal-title" variant="h6" component="h2">
              Your Cart
            </Typography>
            <Divider sx={{ borderBottomWidth: "2px", borderColor: "black" }} />

            {products?.map((item, index) => (
              <React.Fragment key={index}>
                <List
                  sx={{
                    width: "100%",
                    minWidth: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={item.product.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product.title}
                      secondary={
                        <React.Fragment>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              marginTop: 2,
                            }}
                          >
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Price - NPR {convertCurrency(item.product.price)}{" "}
                              * {item.number}
                            </Typography>
                            <Typography
                              sx={{ display: "inline", marginRight: "21px" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Total :{" "}
                              {convertCurrency(
                                item.product.price * item.number
                              )}
                            </Typography>
                          </div>
                        </React.Fragment>
                      }
                    />
                    <IconButton
                      onClick={() => {
                        handleDelete(item.userId, item.product.id);
                      }}
                    >
                      <DeleteIcon sx={{ cursor: "pointer" }} />
                    </IconButton>
                  </ListItem>
                </List>
                {index !== products.length - 1 && (
                  <Divider
                    sx={{
                      borderBottomWidth: "2px",
                      borderColor: "gray",
                    }}
                  />
                )}
              </React.Fragment>
            ))}

            {products == undefined ? (
              <Box sx={{ padding: 5, textAlign: "center" }}>
                {" "}
                No product is added.
              </Box>
            ) : (
              ""
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>
                Grand Total : NPR {convertCurrency(calculateTotal())}{" "}
              </Typography>
              <Button
                disabled={products == undefined}
                variant="outlined"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
