import { Typography } from "@mui/material";

const Logo = () => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="#app-bar-with-responsive-menu"
      sx={{
        mr: 60,
        display: { xs: "none", md: "flex" },
        fontFamily: "titillium",
        fontWeight: 700,
        color: "#A8B1FF",
        textDecoration: "none",
        cursor: "pointer",
        ":hover": {
          color: "#5c73e7",
        },
        fontSize: 25,
      }}
    >
      TIAui
    </Typography>
  );
};

export default Logo;
