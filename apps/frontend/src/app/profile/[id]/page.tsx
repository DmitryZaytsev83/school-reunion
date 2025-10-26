// src/app/profile/[id]/page.tsx
'use client';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, CircularProgress, Alert, Avatar, Link as MuiLink } from '@mui/material';
import { useParams } from 'next/navigation'; // ❌ Не используем, т.к. это Client Component
import { useEffect, useState } from 'react';
import * as React from 'react'; // ✅ Импортируем React

// Импортируем shared-типы
import type { User as SharedUser, Photo as SharedPhoto } from '@app/shared/dist/types';

type ProfilePageProps = {
  params: Promise<{ id: string }>; // ✅ params — Promise
};

export default function ProfilePage({ params }: ProfilePageProps) {
  // ✅ Используем React.use для доступа к асинхронным params
  const { id } = React.use(params);
  const [user, setUser] = useState<SharedUser | null>(null);
  const [photos, setPhotos] = useState<SharedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Можно редиректить на /login, если нужно
      // router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // Загружаем данные пользователя
        const userRes = await fetch(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          // ✅ Улучшим сообщение об ошибке, чтобы понять, в чём проблема
          const errorText = await userRes.text();
          console.error('Ошибка от бэкенда:', errorText);
          throw new Error(`Не удалось загрузить профиль пользователя: ${userRes.status} ${userRes.statusText}`);
        }

        const userData: SharedUser = await userRes.json();
        setUser(userData);

        // Загружаем фото пользователя
        const photosRes = await fetch(`http://localhost:3000/photos/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!photosRes.ok) {
          const errorText = await photosRes.text();
          console.error('Ошибка от бэкенда (фото):', errorText);
          throw new Error(`Не удалось загрузить фото пользователя: ${photosRes.status} ${photosRes.statusText}`);
        }

        const photosData: SharedPhoto[] = await photosRes.json();
        setPhotos(photosData);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]); // ✅ id теперь доступен

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

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Пользователь не найден</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="h5" component="h1">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </Typography>
            </div>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" component="h2" gutterBottom>
        Фотографии
      </Typography>

      {photos.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Пользователь не загрузил ни одной фотографии.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3000/uploads/${photo.filename}`} // Путь к фото
                  alt={photo.originalName}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {photo.description || 'Без описания'}
                  </Typography>
                  {photo.tags && photo.tags.length > 0 && (
                    <Typography variant="caption" color="primary">
                      #{photo.tags.join(', #')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}