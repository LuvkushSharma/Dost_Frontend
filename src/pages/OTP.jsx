import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";


const OTP = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [otp, setOtp] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false); // Track OTP sending state
  const [errorMessage, setErrorMessage] = useState(""); // Display error messages
  const [timerStarts, setTimerStarts] = useState(false);

  const navigate = useNavigate();

  const baseUrl = "https://dost-backend.onrender.com";

  const handleSendOTP = async () => {
    setIsSendingOTP(true);
    setErrorMessage(""); // Clear error message before sending request

    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/send-otp`, {
        phoneNumber: `${countryCode}${phoneNumber}`, // Combine country code and phone number
      }, {headers: { "Content-Type": "application/json" }, withCredentials: true });

      if (response.data.success) {
        console.log("OTP sent successfully");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("An error occurred while sending OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    setErrorMessage(""); // Clear error message before verifying

    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/verify-otp`, {
        phoneNumber: `${countryCode}${phoneNumber}`,
        otp,
      }, {headers: { "Content-Type": "application/json" } , withCredentials: true });

      if (response.data.success) {
        console.log("OTP verified successfully");
        // Handle successful verification (e.g., redirect to login page)
        setTimerStarts(true);

        setTimeout(() => {
          setTimerStarts(false);
          navigate("/home", { replace: true });
        }, 2000);

      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage(
        "An error occurred while verifying OTP. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d9d9d9",
        height: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mt: 1, textAlign: "center" }}>
        MFA (Multi-Factor Authentication)
      </Typography>
      <div
        style={{
          marginTop: "130px",
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            textAlign: "center",
            boxShadow: "1px 2px 8px rgba(1, 1, 15, 0.15)", // Add a subtle shadow
            borderRadius: 4, // Add rounded corners
            bgcolor: "#ced4da",
          }}
        >
          <CardContent>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value)}
                style={{ marginRight: "10px" }}
              >
                <MenuItem value="+91">India (+91)</MenuItem>
                <MenuItem value="+1">United States (+1)</MenuItem>
                <MenuItem value="+86">China (+86)</MenuItem>
                <MenuItem value="+55">Brazil (+55)</MenuItem>
                <MenuItem value="+7">Russia (+7)</MenuItem>
                <MenuItem value="+81">Japan (+81)</MenuItem>
                <MenuItem value="+49">Germany (+49)</MenuItem>
                <MenuItem value="+44">United Kingdom (+44)</MenuItem>
                <MenuItem value="+33">France (+33)</MenuItem>
                <MenuItem value="+39">Italy (+39)</MenuItem>
              </Select>
              <TextField
                label="Phone number"
                variant="outlined"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                type="number"
                disabled={isSendingOTP} // Disable phone number field while sending OTP
                style={{ width: "100%" }}
              />
            </div>
            <Button
              variant="contained"
              disabled={isSendingOTP} // Disable button while sending OTP
              onClick={handleSendOTP}
              sx={{ width: "100%", marginBottom: "10px" }}
            >
              Send OTP
            </Button>
            <TextField
              label="OTP"
              variant="outlined"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              type="number"
              disabled={!phoneNumber}
              style={{ width: "100%" }}
            />
            <Button
              variant="contained"
              disabled={!phoneNumber || !otp}
              onClick={handleVerifyOTP}
              sx={{ width: "100%", marginTop: "10px" }}
            >
              Verify OTP
            </Button>
          </CardContent>
          {timerStarts && (
          <Alert severity="success" sx={{ marginBottom: "1rem" , padding: "10px"}}>
            OTP Verified Successfully !!!
          </Alert>
        )}
        </Card>
      </div>
    </div>
  );
};

export default OTP;
