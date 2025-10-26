// src/app/upload/page.tsx
'use client';
import { Box, Button, Card, CardContent, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link'; // ✅ Добавим Link

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState(''); // Для описания фото
  const [tags, setTags] = useState('');
  const [postText, setPostText] = useState(''); // ✅ Новое поле для текста поста

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    if (tags) {
      formData.append('tags', tags);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // 1. Сначала загружаем фото
      const photoRes = await fetch('http://localhost:3000/photos/upload', {
        method: 'POST',
        headers: {
          // Не указываем 'Content-Type', браузер сам установит boundary
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!photoRes.ok) {
        const errorData = await photoRes.json();
        throw new Error(errorData.message || 'Ошибка загрузки фото');
      }

      const photoData = await photoRes.json();
      console.log('Photo uploaded:', photoData);

      // 2. Если введён текст поста, создаём пост
      if (postText.trim()) {
        const postRes = await fetch('http://localhost:3000/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: postText,
            photoIds: [photoData.id], // Передаём ID загруженного фото
          }),
        });

        if (!postRes.ok) {
          const errorData = await postRes.json();
          console.error('Ошибка создания поста:', errorData);
          // Не бросаем ошибку, т.к. фото уже загружено
        } else {
          const postData = await postRes.json();
          console.log('Post created:', postData);
        }
      }

      alert('Фото успешно загружено!' + (postText.trim() ? ' И пост создан.' : ''));
      router.push('/dashboard'); // Перенаправляем на ленту
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Загрузить фото
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          <Box component="form" noValidate autoComplete="off">
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                id="file"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Скрываем input
              />
              <label htmlFor="file">
                <Button variant="outlined" component="span" fullWidth>
                  {file ? file.name : 'Загрузить файл'}
                </Button>
              </label>
              <FormHelperText sx={{ ml: 0 }}>Поддерживаются изображения (jpg, png и т.д.)</FormHelperText>
            </Box>

            <TextField
              label="Описание фото"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
            />

            <TextField
              label="Теги"
              variant="outlined"
              fullWidth
              margin="normal"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helperText="Укажите теги через запятую (например: выпуск, 11А, 2003)"
            />

            {/* ✅ Новое поле для текста поста */}
            <TextField
              label="Текст поста (необязательно)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              multiline
              rows={3}
              helperText="Если ввести текст, будет создан пост с этим фото"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpload}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Загрузка...' : 'Загрузить фото и опубликовать (если есть текст)'}
            </Button>

            {/* ✅ Добавим ссылку на ленту */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <MuiLink href="/dashboard" underline="hover" color="primary" sx={{ textDecoration: 'none' }}>
                Перейти в ленту
              </MuiLink>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}