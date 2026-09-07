from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from .models import PortfolioItem


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    """
    Админка для элементов портфолио с поддержкой видео из Rutube и VK Видео.
    Включает кнопку для автоматического получения превью из видео.
    """
    list_display = ('title', 'video_source', 'get_thumbnail_preview', 'is_published', 'order', 'created_at')
    list_filter = ('video_source', 'is_published', 'created_at')
    search_fields = ('title', 'description', 'video_url')
    ordering = ('order', '-created_at')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'image')
        }),
        ('Видео', {
            'fields': ('video_url', 'video_source', 'thumbnail_url', 'use_auto_thumbnail'),
            'description': 'Добавьте ссылку на видео с Rutube или VK Видео. Нажмите "Получить превью" для автоматического извлечения обложки.'
        }),
        ('Публикация', {
            'fields': ('is_published', 'order')
        }),
    )
    
    readonly_fields = ('get_thumbnail_preview',)
    
    def get_thumbnail_preview(self, obj):
        """
        Отображает превью обложки в админке.
        """
        if obj.thumbnail_url:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 200px; border-radius: 8px;" />',
                obj.thumbnail_url
            )
        elif obj.video_url:
            # Пытаемся получить превью из видео
            from video_utils.api import get_video_thumbnail
            thumbnail_info = get_video_thumbnail(obj.video_url)
            if thumbnail_info and thumbnail_info.get('thumbnail_url'):
                return format_html(
                    '<img src="{}" style="max-width: 300px; max-height: 200px; border-radius: 8px;" />'
                    '<p style="color: green; margin-top: 10px;">✓ Превью доступно (не сохранено в БД)</p>',
                    thumbnail_info['thumbnail_url']
                )
            else:
                return format_html('<p style="color: orange;">⚠ Превью не найдено. Убедитесь, что ссылка на видео корректна.</p>')
        return format_html('<p style="color: gray;">Нет превью</p>')
    
    get_thumbnail_preview.short_description = 'Предпросмотр обложки'
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """
        Добавляем кнопку для получения превью на страницу редактирования.
        """
        extra_context = extra_context or {}
        obj = None
        if object_id:
            obj = PortfolioItem.objects.filter(pk=object_id).first()
        
        if obj and obj.video_url:
            from video_utils.api import get_video_thumbnail
            thumbnail_info = get_video_thumbnail(obj.video_url)
            if thumbnail_info and thumbnail_info.get('thumbnail_url'):
                extra_context['thumbnail_available'] = True
                extra_context['thumbnail_url'] = thumbnail_info['thumbnail_url']
        
        return super().change_view(request, object_id, form_url, extra_context=extra_context)
    
    def get_urls(self):
        """
        Добавляем кастомный URL для AJAX-запроса получения превью.
        """
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                'get-video-thumbnail/',
                self.admin_site.admin_view(self.get_video_thumbnail_view),
                name='portfolio_get_video_thumbnail',
            ),
        ]
        return custom_urls + urls
    
    def get_video_thumbnail_view(self, request):
        """
        AJAX view для получения превью видео по URL.
        """
        from django.http import JsonResponse
        from video_utils.api import get_video_thumbnail
        
        video_url = request.GET.get('video_url', '')
        
        if not video_url:
            return JsonResponse({
                'success': False,
                'error': 'URL видео не указан'
            })
        
        thumbnail_info = get_video_thumbnail(video_url)
        
        if thumbnail_info and thumbnail_info.get('thumbnail_url'):
            return JsonResponse({
                'success': True,
                'thumbnail_url': thumbnail_info['thumbnail_url'],
                'service': thumbnail_info.get('service'),
                'video_id': thumbnail_info.get('video_id')
            })
        else:
            return JsonResponse({
                'success': False,
                'error': 'Не удалось получить превью. Проверьте ссылку на видео.'
            })
