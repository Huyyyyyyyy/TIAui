import { Container, Toolbar, Typography } from "@mui/material";
import Logo from "./Logo";
import Menu from "./Menu";

const Header = () => {
  return (
    <Container
      style={{ backgroundColor: "#161618", position: "fixed", width: "100%" }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Logo></Logo>
        </Typography>
        <Menu></Menu>
      </Toolbar>
    </Container>
  );
};

export default Header;
