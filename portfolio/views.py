from django.shortcuts import render, get_object_or_404
from .models import PortfolioItem


def portfolio_list(request):
    """
    Отображение списка всех проектов портфолио.
    """
    items = PortfolioItem.objects.filter(is_published=True).order_by('order', '-created_at')
    return render(request, 'portfolio/item_list.html', {'items': items})


def portfolio_detail(request, pk):
    """
    Отображение детальной страницы проекта портфолио.
    """
    item = get_object_or_404(PortfolioItem, pk=pk, is_published=True)
    return render(request, 'portfolio/item_detail.html', {'item': item})
