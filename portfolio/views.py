import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import PortfolioItem
from .utils import get_video_meta


def portfolio_list(request):
    items = PortfolioItem.objects.filter(is_published=True).order_by("order", "-created_at")
    return render(request, "portfolio/item_list.html", {"items": items})


def portfolio_detail(request, pk):
    item = get_object_or_404(PortfolioItem, pk=pk, is_published=True)
    return render(request, "portfolio/item_detail.html", {"item": item})


@csrf_exempt
@require_http_methods(["POST"])
def get_video_meta_view(request):
    try:
        if request.content_type and "json" in (request.content_type or ""):
            payload = json.loads(request.body.decode("utf-8") or "{}")
        else:
            payload = request.POST
        url = (payload.get("url") or payload.get("video_url") or "").strip()
    except Exception:
        return JsonResponse({"success": False, "error": "Некорректный JSON"}, status=400)

    if not url:
        return JsonResponse({"success": False, "error": "URL видео не указан"}, status=400)

    meta = get_video_meta(url)
    if not meta:
        return JsonResponse(
            {
                "success": False,
                "error": "Не удалось определить видео. Проверьте ссылку.",
                "thumbnail": None,
                "is_shorts": False,
                "source": None,
            },
            status=400,
        )

    return JsonResponse(
        {
            "success": True,
            "thumbnail": meta.get("thumbnail"),
            "thumbnail_url": meta.get("thumbnail"),
            "is_shorts": bool(meta.get("is_shorts")),
            "source": meta.get("source"),
            "service": meta.get("source"),
            "video_id": meta.get("video_id"),
        }
    )
