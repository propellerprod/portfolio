from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from django.utils.html import format_html

from .models import PortfolioItem
from .utils import get_video_meta


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    change_form_template = "admin/portfolio_portfolioitem_change_form.html"
    list_display = (
        "title",
        "video_source",
        "get_thumbnail_preview",
        "is_shorts",
        "is_published",
        "order",
        "created_at",
    )
    list_filter = ("video_source", "is_published", "created_at", "is_shorts")
    search_fields = ("title", "description", "video_url")
    ordering = ("order", "-created_at")
    fieldsets = (
        ("Основная информация", {"fields": ("title", "description", "image")}),
        (
            "Видео",
            {
                "fields": (
                    "video_url",
                    "video_source",
                    "thumbnail_url",
                    "use_auto_thumbnail",
                    "is_shorts",
                ),
                "description": "Вставьте ссылку и нажмите «Получить превью».",
            },
        ),
        ("Публикация", {"fields": ("is_published", "order")}),
    )
    readonly_fields = ("get_thumbnail_preview",)

    class Media:
        js = ("admin/js/portfolio_video.js",)

    def get_thumbnail_preview(self, obj):
        if obj and obj.thumbnail_url:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 200px; border-radius: 8px;" />',
                obj.thumbnail_url,
            )
        return format_html('<p style="color: gray;">Нет превью</p>')

    get_thumbnail_preview.short_description = "Предпросмотр обложки"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "get-video-thumbnail/",
                self.admin_site.admin_view(self.get_video_thumbnail_view),
                name="portfolio_get_video_thumbnail",
            ),
        ]
        return custom_urls + urls

    def get_video_thumbnail_view(self, request):
        video_url = request.GET.get("video_url") or request.POST.get("video_url") or ""
        if not video_url:
            return JsonResponse({"success": False, "error": "URL видео не указан"})
        meta = get_video_meta(video_url)
        if meta:
            return JsonResponse(
                {
                    "success": True,
                    "thumbnail_url": meta.get("thumbnail"),
                    "thumbnail": meta.get("thumbnail"),
                    "service": meta.get("source"),
                    "source": meta.get("source"),
                    "video_id": meta.get("video_id"),
                    "is_shorts": meta.get("is_shorts", False),
                }
            )
        return JsonResponse(
            {
                "success": False,
                "error": "Не удалось получить превью. Проверьте ссылку на видео.",
            }
        )
