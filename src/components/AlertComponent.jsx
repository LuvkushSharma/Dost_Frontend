import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

export default function AlertComponent({ request, name, str, severityType }) {
  const handleRemove = () => {
    request(false);
  };

  if (name === undefined) {
    name = "";
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={true}>
        <Alert
          severity={`${severityType}`}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleRemove}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, fontSize: "1.2rem", padding: "16px" }}
        >
          {`${str} ${name}`}
        </Alert>
      </Collapse>
    </Box>
  );
}
