'use client';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, Avatar } from '@mui/material'; // ✅ Добавим Avatar
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AppMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null); // ✅ Новое состояние для аватара
  const [userFirstName, setUserFirstName] = useState<string>(''); // ✅ Для отображения имени в меню
  const [userLastName, setUserLastName] = useState<string>(''); // ✅ Для отображения фамилии в меню

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);

        // ✅ Загрузим данные текущего пользователя
        const fetchCurrentUser = async () => {
          try {
            const res = await fetch('http://localhost:3000/users/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              const userData = await res.json();
              setUserAvatar(userData.avatar);
              setUserFirstName(userData.firstName);
              setUserLastName(userData.lastName);
            }
          } catch (e) {
            console.error('Не удалось загрузить данные пользователя для меню', e);
          }
        };

        fetchCurrentUser();
      } catch (e) {
        console.error('Не удалось декодировать токен', e);
      }
    } else {
      setUserId(null);
      setUserAvatar(null);
      setUserFirstName('');
      setUserLastName('');
    }
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

  const handleMyProfile = () => {
    if (userId) {
      handleMenuClose();
      router.push(`/profile/${userId}`);
    }
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
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleDashboard}>
                Лента
              </Button>
              <Button color="inherit" onClick={handleUpload}>
                Загрузить фото
              </Button>
              {/* ✅ Покажем имя и аватар текущего пользователя в правом углу */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {userFirstName} {userLastName}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account"
                  aria-controls="account-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <Avatar
                    src={userAvatar ? `http://localhost:3000/uploads/${userAvatar}` : undefined} // ✅ Показываем аватар
                    sx={{ width: 32, height: 32 }}
                  >
                    {!userAvatar && (userFirstName.charAt(0) + userLastName.charAt(0)).toUpperCase()} {/* ✅ Только если аватар не установлен */}
                  </Avatar>
                </IconButton>
              </Box>
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
          {/* ✅ Убираем старую кнопку меню, если она была, и используем ту, что внутри isAuthenticated */}
          {/* <IconButton ...>... </IconButton> */}
          <Menu
            id="account-menu" // ✅ Обновим id
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
                <MenuItem key="my-profile" onClick={handleMyProfile}>Мой профиль</MenuItem>,
                <MenuItem key="edit-profile" onClick={handleEditProfile}>Редактировать профиль</MenuItem>,
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