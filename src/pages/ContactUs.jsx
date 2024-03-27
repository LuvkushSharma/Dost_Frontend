import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Navbar from "./../components/Navbar";

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = "https://dost-backend.onrender.com";

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${baseUrl}/api/v1/users/contact`, {
        name,
        message,
      }, { withCredentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    setName("");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <Container
        component="main"
        maxWidth="sm"
        style={{
          backgroundColor: "#ced4da",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "80px",
          border: "1px solid #495057",
          boxShadow: "0 0 10px #2b2d42",
        }}
      >
        <div>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
              onChange={handleNameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              id="message"
              label="Message"
              name="message"
              value={message}
              onChange={handleMessageChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#495057", borderRadius: "20px" }}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Contact;
