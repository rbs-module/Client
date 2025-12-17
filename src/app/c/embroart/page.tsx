"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid2,
} from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          bgcolor: "linear-gradient(135deg, #f3f3f3, #fafafa)",
          p: 4,
          overflow: "hidden",
        }}
      >
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          EmbroArt
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          100% Export-Quality Computerized Embroidery
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 3 }}>
          Explore Our Work
        </Button>
        <div className="absolute -z-10 opacity-30 w-full  -top-10 left-0 h-[100vh]">
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img
            src={
              "https://apparelresources.com/wp-content/uploads/2019/05/Embroidery-Machine.jpg"
            }
            width={"100%"}
            height={"100vh"}
          />
        </div>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 10, pt: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          maxWidth="md"
          mx="auto"
        >
          At EmbroArt, we specialize in delivering world-class embroidery
          solutions for garments, accessories, and corporate branding. With
          precision, creativity, and passion, we help businesses stand out with
          unique embroidery designs.
        </Typography>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Services
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              title: "Garment Embroidery",
              desc: "High-quality stitching for fashion & apparel.",
            },
            {
              title: "Corporate Branding",
              desc: "Logos & designs for uniforms & promotions.",
            },
            {
              title: "Custom Designs",
              desc: "Tailored embroidery for your creative ideas.",
            },
          ].map((service, i) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={i}>
              <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {service.title}
                </Typography>
                <Typography color="text.secondary">{service.desc}</Typography>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Get in Touch
        </Typography>
        <Typography>Email: contact@embroart.com</Typography>
        <Typography>Phone: +880-1XXXXXXXXX</Typography>
        <Button variant="outlined" sx={{ mt: 3 }}>
          Contact Us
        </Button>
      </Box>
    </Container>
  );
}
