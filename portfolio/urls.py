from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("api/get-video-meta/", views.get_video_meta_view, name="get_video_meta"),
    path("", views.portfolio_list, name="list"),
    path("<int:pk>/", views.portfolio_detail, name="detail"),
]
