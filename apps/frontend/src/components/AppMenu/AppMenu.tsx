// src/components/AppMenu.tsx
'use client';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AppMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // ✅ Используем состояние для аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Проверяем токен только на клиенте
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleMenuClose();
    router.push('/login');
  };

  const handleRegister = () => {
    handleMenuClose();
    router.push('/register');
  };

  const handleDashboard = () => {
    handleMenuClose();
    router.push('/dashboard');
  };

  const handleUpload = () => {
    handleMenuClose();
    router.push('/upload');
  };

  const handleHome = () => {
    handleMenuClose();
    router.push('/');
  };

  const handleEditProfile = () => {
    handleMenuClose();
    router.push('/profile/edit');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHome}>
          Одноклассники
        </Typography>
        <div>
          {/* ✅ Рендерим разные кнопки в зависимости от состояния isAuthenticated */}
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleDashboard}>
                Лента
              </Button>
              <Button color="inherit" onClick={handleUpload}>
                Загрузить фото
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLogin}>
                Вход
              </Button>
              <Button color="inherit" onClick={handleRegister}>
                Регистрация
              </Button>
            </>
          )}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem key="home" onClick={handleHome}>Главная</MenuItem>
            {isAuthenticated ? (
              [
                <MenuItem key="dashboard" onClick={handleDashboard}>Лента</MenuItem>,
                <MenuItem key="upload" onClick={handleUpload}>Загрузить фото</MenuItem>,
                <MenuItem key="edit-profile" onClick={handleEditProfile}>Редактировать профиль</MenuItem>
              ]
            ) : (
              [
                <MenuItem key="login" onClick={handleLogin}>Вход</MenuItem>,
                <MenuItem key="register" onClick={handleRegister}>Регистрация</MenuItem>,
              ]
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}