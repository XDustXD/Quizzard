import { AppBar, Toolbar, Typography, Button, Box, Link, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import ChangePasswordDialog from './ChangePasswordDialog';
import HistoryDialog from './HistoryDialog';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import { useAuth } from '../context/AuthContext';

interface Props {
  onOpenLeaderboard?: () => void;
  onOpenAbout?: () => void;
  loginOpen?: boolean;
  setLoginOpen?: (v: boolean) => void;
  registerOpen?: boolean;
  setRegisterOpen?: (v: boolean) => void;
  setAccountOpen?: (v: boolean) => void;
  setAdminOpen?: (v: boolean) => void;
}

const Header = ({ onOpenLeaderboard, onOpenAbout, loginOpen: loginOpenProp, setLoginOpen: setLoginOpenProp, registerOpen: registerOpenProp, setRegisterOpen: setRegisterOpenProp, setAccountOpen: setAccountOpenProp }: Props) => {
  const [loginOpenLocal, setLoginOpenLocal] = useState(false);
  const [registerOpenLocal, setRegisterOpenLocal] = useState(false);
  const loginOpen = typeof loginOpenProp === 'boolean' ? loginOpenProp : loginOpenLocal;
  const registerOpen = typeof registerOpenProp === 'boolean' ? registerOpenProp : registerOpenLocal;
  const setLoginOpen = setLoginOpenProp ?? setLoginOpenLocal;
  const setRegisterOpen = setRegisterOpenProp ?? setRegisterOpenLocal;
  const setAccountOpen = setAccountOpenProp ?? ((v: boolean) => setLoginOpen(v));
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <Link href="/" color="inherit" underline="none">
                Quizzard
              </Link>
            </Typography>
            <Button color="inherit" onClick={onOpenLeaderboard}>Рейтинг</Button>
            <Button color="inherit" onClick={onOpenAbout}>О проекте</Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user ? (
              <>
                  <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    {user.displayName}
                  </Button>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <MenuItem onClick={() => { setAccountOpen(true); setAnchorEl(null); }}>Профиль</MenuItem>
                    <MenuItem onClick={() => { setHistoryOpen(true); setAnchorEl(null); }}>История</MenuItem>
                    <MenuItem onClick={() => { setChangePwOpen(true); setAnchorEl(null); }}>Сменить пароль</MenuItem>
                    <MenuItem onClick={() => { logout(); setAnchorEl(null); }}>Выйти</MenuItem>
                  </Menu>
              </>
            ) : (
              <>
                <Button variant="outlined" color="inherit" onClick={() => setLoginOpen(true)}>Войти</Button>
                <Button variant="contained" color="secondary" onClick={() => setRegisterOpen(true)}>Зарегистрироваться</Button>
              </>
            )}
          </Box>
          <ChangePasswordDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
          <HistoryDialog open={historyOpen} onClose={() => setHistoryOpen(false)} />
          <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
          <RegisterDialog open={registerOpen} onClose={() => setRegisterOpen(false)} />
        </Toolbar>
      </AppBar>
      <Toolbar /> 
    </>
  );
};

export default Header;