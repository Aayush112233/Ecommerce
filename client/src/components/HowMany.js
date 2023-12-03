import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import { Divider, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Container, ButtonGroup, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { toast } from "react-toastify";

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
  width: 310,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function HowMany({ openStatus, setOpenModal2, data }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpenModal2(false);
  const [count, setCount] = useState(1);
  const handleChange = (event) => {
    setCount(Math.max(Number(event.target.value), 1));
  };

  const [userData, setUserData] = useState(null);

  React.useEffect(() => {
    // Fetch user data from local storage when the component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      // Parse the JSON string back to an object
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

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
          setOpenModal2(false)
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
            <Typography id="spring-modal-title" variant="h6" component="h2">
              How many ?
            </Typography>
            <Divider sx={{ borderBottomWidth: "2px", borderColor: "black" }} />
            <Container sx={{ mt: 3, mx: "auto", width: "100%" }}>
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
            </Container>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              fullWidth
              onClick={handleCartAdd}
            >
              Add To Cart
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
