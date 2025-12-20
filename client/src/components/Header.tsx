import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';

const Header = () => {
  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Link href="/" color="inherit" underline="none">
              Quizzard
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">Rating</Button>
            <Button color="inherit">About</Button>
            <Button variant="outlined" color="inherit">Login</Button>
            <Button variant="contained" color="secondary">Register</Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from going under the fixed header */}
      <Toolbar /> 
    </>
  );
};

export default Header;