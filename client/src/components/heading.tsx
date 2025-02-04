import { MenuList, Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
// import './Header.css';

export default function Header() {
  return (
    <Container>
      <Box sx={{ flexGrow: 1, marginY: 4 }} className="navbar">
        <MenuList className="menu-list">
          <Typography variant="h2" gutterBottom>
            h2. Heading
          </Typography>
        </MenuList>
      </Box>
    </Container>
  );
}
