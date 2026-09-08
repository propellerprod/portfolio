from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0002_portfolioitem_is_shorts_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="portfolioitem",
            name="video_url",
            field=models.CharField(
                blank=True, max_length=500, null=True, verbose_name="Ссылка на видео"
            ),
        ),
        migrations.AlterField(
            model_name="portfolioitem",
            name="thumbnail_url",
            field=models.CharField(
                blank=True, max_length=500, null=True, verbose_name="Ссылка на обложку"
            ),
        ),
    ]
