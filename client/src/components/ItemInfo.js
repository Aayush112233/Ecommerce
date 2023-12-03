import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, ButtonGroup, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blueGrey[50]),
  backgroundColor: blueGrey[50],
  borderColor: blueGrey[200],
  "&:hover": {
    backgroundColor: blueGrey[100],
    borderColor: blueGrey[300],
  },
}));

const StyledInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: 0,
      borderColor: blueGrey[200],
    },
    "&:hover fieldset": {
      borderColor: blueGrey[300],
    },
    "&.Mui-focused fieldset": {
      borderColor: blueGrey[500],
    },
    "& input": {
      textAlign: "center",
      width: 60,
      color: blueGrey[700],
    },
  },
});

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
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ItemInfo({ openStatus, data, setOpenModal }) {
  const [info, setInfo] = React.useState({});
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [userData, setUserData] = React.useState(null);
  const navigate = useNavigate();
  const [count, setCount] = React.useState(1);
  const handleChange = (event) => {
    setCount(Math.max(Number(event.target.value), 1));
  };
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


  const handleCartAdd = () => {
    axios
      .post("http://localhost:9000/add-external-to-cart", {
        userId: userData.id,
        productId: data.id,
        number: count,
      })
      .then((res) => {
        if (res) {
          toast.success("Product Added Successfully");
          setOpenModal(false);
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Failed to add ");
        }
      });
  };
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
            <Card sx={{ maxWidth: 1, boxShadow: "none" }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="400"
                  image={data.image}
                  alt="shop"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {data.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  NPR {convertCurrency(data.price)}
                </Typography>
                <ButtonGroup>
                  <StyledButton
                    onClick={() => setCount((prev) => prev - 1)}
                    disabled={count === 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </StyledButton>
                  <StyledInput
                    size="small"
                    onChange={handleChange}
                    value={count}
                  />
                  <StyledButton onClick={() => setCount((prev) => prev + 1)}>
                    <AddIcon fontSize="small" />
                  </StyledButton>
                </ButtonGroup>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => {
                    handleCartAdd(data);
                  }}
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
