'use client';
import { Box, Button, Card, CardContent, Container, TextField, Typography, CircularProgress, Alert, Avatar, IconButton, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CameraAlt } from '@mui/icons-material'; // Иконка камеры

// Импортируем shared-типы
import type { User as SharedUser } from '@app/shared/dist/types';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SharedUser | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // email можно оставить, но не редактировать
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/profile', { // Получаем профиль текущего юзера
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Не удалось загрузить профиль');
        }

        // ❗️ВАЖНО: /auth/profile возвращает только { message: 'You are authenticated' }
        // Нам нужен реальный endpoint, например, /users/me
        // Пока используем фиктивный ID, но в реальности нужно создать /users/me
        const profileRes = await fetch('http://localhost:3000/users/ec5d23e0-87e1-444d-a105-ce6442194b66', { // ❗️ВРЕМЕННО
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) {
          throw new Error('Не удалось загрузить данные пользователя');
        }

        const userData: SharedUser = await profileRes.json();
        setUser(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        if (userData.avatar) {
          setAvatarPreview(`http://localhost:3000/uploads/${userData.avatar}`); // ❗️ВРЕМЕННО
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Предварительный просмотр
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      // ❗️ВАЖНО: Нужен endpoint на бэкенде для обновления профиля, например, PATCH /users/me
      // Пока используем фиктивный вызов, но в реальности нужно создать такой маршрут
      const res = await fetch('http://localhost:3000/users/ec5d23e0-87e1-444d-a105-ce6442194b66', { // ❗️ВРЕМЕННО
        method: 'PATCH', // или PUT
        headers: {
          // Не указываем 'Content-Type', браузер сам установит boundary
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ошибка обновления профиля');
      }

      alert('Профиль успешно обновлён!');
      router.push('/profile/ec5d23e0-87e1-444d-a105-ce6442194b66'); // ❗️ВРЕМЕННО
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Ошибка: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Редактировать профиль
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={avatarPreview || undefined}
              sx={{ width: 100, height: 100, mb: 1 }}
            >
              {!avatarPreview && user && `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
            </Avatar>
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CameraAlt />}
              >
                Изменить фото
              </Button>
            </label>
          </Box>

          <TextField
            label="Имя"
            variant="outlined"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Фамилия"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            disabled // ❗️Email не редактируем
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSave}
            disabled={saving}
            startIcon={saving && <CircularProgress size={20} />}
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}