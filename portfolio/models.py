from django.db import models


class PortfolioItem(models.Model):
    """
    Модель элемента портфолио с поддержкой видео из Rutube и VK Видео.
    """
    VIDEO_SOURCE_CHOICES = [
        ('rutube', 'Rutube'),
        ('vk', 'VK Видео'),
        ('other', 'Другое'),
    ]
    
    title = models.CharField(
        max_length=255,
        verbose_name='Название проекта'
    )
    description = models.TextField(
        blank=True,
        verbose_name='Описание'
    )
    
    # Поле для ссылки на видео
    video_url = models.URLField(
        max_length=500,
        blank=True,
        verbose_name='Ссылка на видео (Rutube или VK Видео)'
    )
    
    # Определяем источник видео
    video_source = models.CharField(
        max_length=20,
        choices=VIDEO_SOURCE_CHOICES,
        default='other',
        verbose_name='Источник видео'
    )
    
    # Поле для обложки (превью)
    # Хранит только URL изображения, не скачивает файл
    thumbnail_url = models.URLField(
        max_length=500,
        blank=True,
        verbose_name='Ссылка на обложку (превью)'
    )
    
    # Флаг: использовать ли автоматическое превью
    use_auto_thumbnail = models.BooleanField(
        default=False,
        verbose_name='Автоматически получать превью из видео'
    )
    
    # Дополнительное изображение проекта (опционально)
    image = models.ImageField(
        upload_to='portfolio/',
        blank=True,
        null=True,
        verbose_name='Изображение проекта'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    
    is_published = models.BooleanField(
        default=True,
        verbose_name='Опубликовано'
    )
    
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Порядок отображения'
    )
    
    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Элемент портфолио'
        verbose_name_plural = 'Портфолио'
    
    def __str__(self):
        return self.title
    
    def get_thumbnail_url(self):
        """
        Возвращает URL обложки: либо заданный вручную, либо из video_url.
        """
        if self.thumbnail_url:
            return self.thumbnail_url
        
        if self.use_auto_thumbnail and self.video_url:
            from video_utils.api import get_video_thumbnail
            thumbnail_info = get_video_thumbnail(self.video_url)
            if thumbnail_info and thumbnail_info.get('thumbnail_url'):
                return thumbnail_info['thumbnail_url']
        
        return None
    
    def get_embed_url(self):
        """
        Возвращает URL для встраивания видео (iframe).
        """
        if not self.video_url:
            return None
        
        from video_utils.api import get_embed_url
        return get_embed_url(self.video_url)
    
    def get_video_id(self):
        """
        Возвращает ID видео в сервисе.
        """
        if not self.video_url:
            return None
        
        from video_utils.api import extract_video_id_rutube, extract_video_id_vk
        
        if 'rutube.ru' in self.video_url.lower():
            return extract_video_id_rutube(self.video_url)
        elif 'vk.com' in self.video_url.lower() and '/video' in self.video_url.lower():
            return extract_video_id_vk(self.video_url)
        
        return None
