import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Grid2,
} from "@mui/material";

import Link from "next/link";
const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ top: 0 }} color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            RBS
          </Typography>
          <Link href={"/auth/login"}>
            <Button color="inherit">Login</Button>
          </Link>
          <Link href={"/auth/register"}>
            <Button color="inherit">Register</Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 8, pt: 20 }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom align="center">
            Simplify Your Embroidery Workflow
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center">
            Manage orders, track inventory, and streamline your embroidery
            business with EmbroSoft.
          </Typography>
          <Box textAlign="center" mt={4}>
            <Link href={"/auth/login"}>
              <Button variant="contained" color="primary" size="large">
                Get Started
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={4}>
            {[
              {
                title: "Order Management",
                description:
                  "Easily manage all your embroidery orders in one place.",
              },
              {
                title: "Inventory Tracking",
                description:
                  "Keep tabs on your threads, fabrics, and supplies effortlessly.",
              },
              {
                title: "Customer Insights",
                description:
                  "Understand your customers with analytics and history.",
              },
              {
                title: "Accounting Insights",
                description:
                  "Understand your accounts with analytics and history.",
              },
            ].map((feature, index) => (
              <Grid2 size={{ xs: 12, md: 4 }} key={index}>
                <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{ bgcolor: "#1976d2", color: "#fff", py: 3, textAlign: "center" }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} RBS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
