/**
 * Скрипт для автоматического получения превью видео из Rutube, VK Видео, YouTube и VK Клипов
 * в админ-панели Django.
 */

(function($) {
    $(document).ready(function() {
        // Находим поле с URL видео
        var videoUrlField = $('#id_video_url');
        var thumbnailUrlField = $('#id_thumbnail_url');
        var useAutoThumbnailCheckbox = $('#id_use_auto_thumbnail');
        var isShortsCheckbox = $('#id_is_shorts');
        
        // Создаем кнопку для получения превью
        if (videoUrlField.length && thumbnailUrlField.length) {
            var buttonContainer = $('<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;"></div>');
            var getThumbnailBtn = $(
                '<button type="button" id="get-video-thumbnail-btn" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 20px; ' +
                'border-radius: 4px; cursor: pointer; font-size: 14px;">' +
                '📷 Получить превью из видео' +
                '</button>'
            );
            var statusMessage = $('<span id="thumbnail-status" style="margin-left: 10px; font-weight: bold;"></span>');
            var previewContainer = $('<div id="thumbnail-preview-container" style="margin-top: 10px;"></div>');
            
            buttonContainer.append(getThumbnailBtn);
            buttonContainer.append(statusMessage);
            buttonContainer.append(previewContainer);
            
            // Вставляем кнопку после поля video_url
            videoUrlField.closest('.form-row').after(
                $('<div class="form-row"></div>').append(buttonContainer)
            );
            
            // Обработчик клика по кнопке
            getThumbnailBtn.on('click', function(e) {
                e.preventDefault();
                
                var videoUrl = videoUrlField.val().trim();
                
                if (!videoUrl) {
                    statusMessage.css('color', '#dc3545').text('⚠ Введите ссылку на видео');
                    return;
                }
                
                // Показываем индикатор загрузки
                getThumbnailBtn.prop('disabled', true).text('⏳ Загрузка...');
                statusMessage.css('color', '#6c757d').text('Получение превью...');
                
                // AJAX запрос к нашему endpoint
                $.ajax({
                    url: '/admin/portfolio/portfolioitem/get-video-thumbnail/',
                    data: {
                        'video_url': videoUrl
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success && response.thumbnail_url) {
                            // Устанавливаем URL превью в поле
                            thumbnailUrlField.val(response.thumbnail_url);
                            
                            // Определяем тип сервиса для отображения
                            var serviceNames = {
                                'rutube': 'Rutube',
                                'vk': 'VK Видео',
                                'youtube': 'YouTube',
                                'vk_clip': 'VK Клип'
                            };
                            var serviceName = serviceNames[response.service] || response.service || 'видео';
                            
                            // Показываем сообщение об успехе
                            var shortsText = response.is_shorts ? ' 📱 Shorts/Клип' : '';
                            statusMessage.css('color', '#28a745')
                                .html('✓ Превью получено! (' + serviceName + ')' + shortsText);
                            
                            // Показываем предпросмотр с учетом пропорций
                            var containerStyle = response.is_shorts 
                                ? 'max-width: 200px; max-height: 350px;' 
                                : 'max-width: 300px; max-height: 200px;';
                            
                            previewContainer.html(
                                '<img src="' + response.thumbnail_url + '" ' +
                                'style="' + containerStyle + ' border-radius: 8px; ' +
                                'border: 2px solid #28a745; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">'
                            );
                            
                            // Автоматически ставим галочку "использовать авто-превью"
                            useAutoThumbnailCheckbox.prop('checked', true);
                            
                            // Автоматически ставим/снимаем галочку is_shorts
                            if (isShortsCheckbox.length) {
                                isShortsCheckbox.prop('checked', response.is_shorts || false);
                            }
                            
                        } else {
                            // Ошибка
                            var errorMsg = response.error || 'Не удалось получить превью';
                            statusMessage.css('color', '#dc3545').text('⚠ ' + errorMsg);
                            previewContainer.html('');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error getting thumbnail:', error);
                        statusMessage.css('color', '#dc3545')
                            .text('⚠ Ошибка соединения: ' + error);
                        previewContainer.html('');
                    },
                    complete: function() {
                        // Возвращаем кнопку в исходное состояние
                        getThumbnailBtn.prop('disabled', false).text('📷 Получить превью из видео');
                    }
                });
            });
            
            // Автоматическая подсветка при изменении URL
            videoUrlField.on('change', function() {
                var videoUrl = $(this).val().trim();
                if (videoUrl) {
                    statusMessage.css('color', '#007bff').text('ℹ Нажмите кнопку для получения превью');
                } else {
                    statusMessage.text('');
                    previewContainer.html('');
                }
            });
        }
    });
})(django.jQuery || jQuery);
