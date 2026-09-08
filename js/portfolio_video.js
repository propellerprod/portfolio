/**
 * Кнопка «Получить превью» в админке: POST /api/get-video-meta/
 */
(function ($) {
    function getCookie(name) {
        var value = null;
        if (!document.cookie) {
            return value;
        }
        document.cookie.split(";").forEach(function (part) {
            var cookie = $.trim(part);
            if (cookie.substring(0, name.length + 1) === name + "=") {
                value = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
        return value;
    }

    $(document).ready(function () {
        var videoUrlField = $("#id_video_url");
        var thumbnailUrlField = $("#id_thumbnail_url");
        var sourceSelect = $("#id_video_source");
        var isShortsCheckbox = $("#id_is_shorts");
        var useAutoThumbnailCheckbox = $("#id_use_auto_thumbnail");

        if (!videoUrlField.length || !thumbnailUrlField.length) {
            return;
        }

        var buttonContainer = $(
            '<div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;"></div>'
        );
        var getThumbnailBtn = $(
            '<button type="button" id="get-video-thumbnail-btn" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 20px; ' +
                'border-radius: 4px; cursor: pointer; font-size: 14px;">' +
                "📷 Получить превью" +
                "</button>"
        );
        var statusMessage = $(
            '<span id="thumbnail-status" style="margin-left: 10px; font-weight: bold;"></span>'
        );
        var previewContainer = $('<div id="thumbnail-preview-container" style="margin-top: 10px;"></div>');

        buttonContainer.append(getThumbnailBtn);
        buttonContainer.append(statusMessage);
        buttonContainer.append(previewContainer);
        videoUrlField.closest(".form-row").after($('<div class="form-row"></div>').append(buttonContainer));

        function detectSource(url) {
            var low = (url || "").toLowerCase();
            if (low.indexOf("rutube.ru") !== -1) return "rutube";
            if (low.indexOf("youtube.com") !== -1 || low.indexOf("youtu.be") !== -1) return "youtube";
            if (low.indexOf("vk.com") !== -1 || low.indexOf("vkvideo.ru") !== -1) {
                if (low.indexOf("/clips") !== -1 || low.indexOf("/clip") !== -1) return "vk_clip";
                return "vk";
            }
            return "";
        }

        videoUrlField.on("change blur", function () {
            var detected = detectSource($(this).val());
            if (detected && sourceSelect.length) {
                sourceSelect.val(detected);
            }
        });

        getThumbnailBtn.on("click", function (e) {
            e.preventDefault();
            var videoUrl = $.trim(videoUrlField.val() || "");
            if (!videoUrl) {
                statusMessage.css("color", "#dc3545").text("⚠ Введите ссылку на видео");
                return;
            }

            getThumbnailBtn.prop("disabled", true).text("⏳ Загрузка...");
            statusMessage.css("color", "#6c757d").text("Получение превью...");

            $.ajax({
                url: "/api/get-video-meta/",
                method: "POST",
                contentType: "application/json",
                headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
                data: JSON.stringify({ url: videoUrl }),
                dataType: "json",
                success: function (response) {
                    if (response.success) {
                        var thumb = response.thumbnail || response.thumbnail_url;
                        if (thumb) {
                            thumbnailUrlField.val(thumb);
                        }
                        if (sourceSelect.length && response.source) {
                            sourceSelect.val(response.source);
                        }
                        if (isShortsCheckbox.length) {
                            isShortsCheckbox.prop("checked", !!response.is_shorts);
                        }
                        if (useAutoThumbnailCheckbox.length) {
                            useAutoThumbnailCheckbox.prop("checked", true);
                        }
                        var names = {
                            rutube: "Rutube",
                            vk: "VK Видео",
                            youtube: "YouTube",
                            vk_clip: "VK Клип",
                        };
                        statusMessage
                            .css("color", "#28a745")
                            .html(
                                "✓ Метаданные получены (" +
                                    (names[response.source] || response.source || "") +
                                    ")" +
                                    (response.is_shorts ? " 📱 Shorts/Клип" : "")
                            );
                        if (thumb) {
                            previewContainer.html(
                                '<img src="' +
                                    thumb +
                                    '" style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #28a745;">'
                            );
                        } else {
                            previewContainer.html("");
                        }
                    } else {
                        statusMessage
                            .css("color", "#dc3545")
                            .text("⚠ " + (response.error || "Не удалось получить превью"));
                        previewContainer.html("");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("get-video-meta error", status, error, xhr && xhr.responseText);
                    statusMessage.css("color", "#dc3545").text("⚠ Ошибка соединения: " + error);
                    previewContainer.html("");
                },
                complete: function () {
                    getThumbnailBtn.prop("disabled", false).text("📷 Получить превью");
                },
            });
        });
    });
})(window.django && django.jQuery ? django.jQuery : window.jQuery);
