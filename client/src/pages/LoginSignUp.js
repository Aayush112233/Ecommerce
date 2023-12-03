import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import signUp from "../assets/images/16544.jpg";
import ecom from "../assets/images/ecom.jpg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: login,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userData");
  }, []);

  const [haveAcc, setHaveAcc] = useState(true);

  const onSubmit = async (form) => {
    try {
      const response = await axios.post("http://localhost:9000/signup", form);
      console.log("Signup successful:", response.data);
      toast.success("Registration Sucessfull. Please Sign In")
      setHaveAcc(true);
    } catch (error) {
      console.error("Signup failed:", error.response.data);
    }
  };

  const handleLogin = async (form) => {
    try {
      const response = await axios.post("http://localhost:9000/login", form);
      console.log("Login successful:", response.data);      
      navigate("/");
      // Save user data to local storage after successful login
      if (response.data && response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Login failed:", error.response.data);
      toast.error("Unable to login. Please fill correct credentials.")
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          backgroundImage: `url(${ecom})`,
          justifyContent: "center",
          alignItems: "center",
          backgroundSize: "cover", 
        }}
      >
        <Card
          sx={{
            padding: 2,
            width: 800,
            borderRadius: "20px",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Typography variant="h4" textAlign={"center"}>
                {haveAcc ? "Sign In" : "Sign Up"}
              </Typography>
              <Divider
                sx={{
                  mt: 2,
                }}
              />
              <img
                src={signUp}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {haveAcc ? (
                <form
                  onSubmit={handleLoginSubmit(handleLogin)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems={"center"}
                    margin={"auto"}
                    sx={{
                      width: {
                        md: "400px",
                      },
                    }}
                  >
                    {/* Rest of your form elements */}
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        name="email"
                        error={!!loginError.email}
                        helperText={
                          loginError.email ? loginError.email.message : ""
                        }
                        {...login("email", {
                          required: "Email is required",
                          // Add other validation rules if needed
                        })}
                        variant="standard"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="standard-basic"
                        label="Password"
                        name="password"
                        error={!!loginError.password}
                        helperText={
                          loginError.password
                            ? loginError.password.message
                            : "Must be 8 characters at least"
                        }
                        variant="standard"
                        {...login("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          // Add other validation rules if needed
                        })}
                        type="password"
                        fullWidth
                      />
                    </Grid>
                    {/* Rest of your form elements */}
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      borderRadius: "25px",
                      width: "50%",
                      marginTop: "20px",
                      marginX: "auto",
                    }}
                  >
                    Sign In
                  </Button>
                  <Typography
                    color={"black"}
                    sx={{
                      p: 2,
                      margin: "auto",
                    }}
                  >
                    Don't have an account?{" "}
                    <a
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setHaveAcc(!haveAcc);
                      }}
                    >
                      Sign Up
                    </a>
                  </Typography>
                </form>
              ) : (
                <Grid
                  container
                  justifyContent={"center"}
                  spacing={2}
                  minHeight="100%"
                  overflow={"auto"}
                  padding={1}
                >
                  <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "1.5rem",
                        },
                      }}
                      color={"gray"}
                    >
                      Sign Up for an Account
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.firstName}
                      name="firstName"
                      helperText={
                        errors.firstName ? errors.firstName.message : ""
                      }
                      label="First Name"
                      variant="standard"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.lastName}
                      name="lastName"
                      helperText={
                        errors.lastName ? errors.lastName.message : ""
                      }
                      label="Last Name"
                      variant="standard"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.email}
                      name="email"
                      helperText={errors.email ? errors.email.message : ""}
                      label="Email"
                      variant="standard"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email address",
                        },
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone"
                      label="Phone Number"
                      variant="standard"
                      {...register("phoneNumber")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.permanentAddress}
                      name="permanentAddress"
                      helperText={
                        errors.permanentAddress
                          ? errors.permanentAddress.message
                          : ""
                      }
                      label="Permanent Address"
                      variant="standard"
                      {...register("permanentAddress", {
                        required: "Permanent address is required",
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.temporaryAddress}
                      name="temporaryAddress"
                      helperText={
                        errors.temporaryAddress
                          ? errors.temporaryAddress.message
                          : ""
                      }
                      label="Temporary Address"
                      variant="standard"
                      {...register("temporaryAddress", {
                        required: "Temporary address is required",
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.password}
                      name="password"
                      id="password"
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                      label="Password"
                      variant="standard"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={!!errors.confirmPassword}
                      name="confirmPassword"
                      helperText={
                        errors.confirmPassword
                          ? errors.confirmPassword.message
                          : ""
                      }
                      label="Confirm Password"
                      variant="standard"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === document.getElementById("password").value ||
                          "Passwords do not match",
                      })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        borderRadius: "25px",
                        cursor: "pointer",
                      }}
                      fullWidth
                      onClick={handleSubmit(onSubmit)}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography color={"black"}>
                      Already have an account?{" "}
                      <a
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setHaveAcc(!haveAcc);
                        }}
                      >
                        Sign In
                      </a>
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
};
