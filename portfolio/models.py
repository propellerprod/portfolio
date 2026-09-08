from django.db import models


class PortfolioItem(models.Model):
    """
    Элемент портфолио с видео Rutube / VK / YouTube / VK Clips.
    """

    VIDEO_SOURCE_CHOICES = [
        ("rutube", "Rutube"),
        ("vk", "VK Видео"),
        ("youtube", "YouTube"),
        ("vk_clip", "VK Клип"),
        ("other", "Другое"),
    ]

    title = models.CharField(max_length=255, verbose_name="Название проекта")
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(
        upload_to="portfolio/",
        blank=True,
        null=True,
        verbose_name="Изображение проекта",
    )
    video_url = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Ссылка на видео",
    )
    video_source = models.CharField(
        max_length=20,
        choices=VIDEO_SOURCE_CHOICES,
        default="other",
        verbose_name="Источник видео",
    )
    thumbnail_url = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Ссылка на обложку",
    )
    is_shorts = models.BooleanField(
        default=False,
        verbose_name="Вертикальное видео (Shorts/Клип)",
    )
    use_auto_thumbnail = models.BooleanField(
        default=False,
        verbose_name="Автоматически получать превью из видео",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Элемент портфолио"
        verbose_name_plural = "Портфолио"

    def __str__(self):
        return self.title

    def get_thumbnail_url(self):
        if self.thumbnail_url:
            return self.thumbnail_url
        if self.use_auto_thumbnail and self.video_url:
            from video_utils.api import get_video_meta

            meta = get_video_meta(self.video_url)
            if meta and meta.get("thumbnail"):
                return meta["thumbnail"]
        return None

    def get_embed_url(self):
        if not self.video_url:
            return None
        from video_utils.api import get_embed_url

        return get_embed_url(self.video_url)

    def get_video_id(self):
        if not self.video_url:
            return None
        from video_utils.api import get_video_meta

        meta = get_video_meta(self.video_url)
        return (meta or {}).get("video_id")
