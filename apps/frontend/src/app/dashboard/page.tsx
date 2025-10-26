// src/app/dashboard/page.tsx
'use client';
import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, CircularProgress, Alert, Link as MuiLink } from '@mui/material'; // ✅ Добавим MuiLink
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // ✅ Импортируем Link из next

// Импортируем shared-типы
import type { Post as SharedPost } from '@app/shared/dist/types';

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<SharedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Не удалось загрузить посты');
        }

        const data: SharedPost[] = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Лента
      </Typography>

      {posts.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Пока нет постов.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card>
                {post.photos && post.photos.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3000/uploads/${post.photos[0].filename}`} // Путь к фото
                    alt={post.photos[0].originalName}
                  />
                )}
                <CardContent>
                  {/* ✅ Оборачиваем имя в Link */}
                  <Typography variant="h6" component="h2">
                    <Link
                      href={`/profile/${post.author.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <MuiLink
                        component="span"
                        underline="hover"
                        color="primary"
                      >
                        {post.author.firstName} {post.author.lastName}
                      </MuiLink>
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.text}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(post.createdAt).toLocaleString('ru-RU')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}