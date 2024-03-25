import React from "react";
import { Box, Typography, Stack, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import Container from "@mui/material/Container";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5", py: 2, mt: 5 }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" fontSize={"20px"}>
            © 2024 <span style={{ color: "#003049" }}>Dost</span>
          </Typography>
          <Link
            href="https://github.com/Luvkush8941"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon sx={{ color: "#333", fontSize: 42 }} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/luvkush-sharma-4581a3225"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon sx={{ color: "#0077b5", fontSize: 42 }} />
          </Link>
          <Link
            href="https://twitter.com/your-twitter-username"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon sx={{ color: "#0077b5", fontSize: 42 }} />
          </Link>
          <Link
            href="https://instagram.com/your-instagram-username"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon
              sx={{
                background:
                  "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d, #f56040, #f77737, #fcaf45, #ffdc80)",
                fontSize: 42,
                color: "white",
                borderRadius: "10px",
                padding: "4px",
              }}
            />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;