document.addEventListener('DOMContentLoaded', function() {
    var translateButton = document.getElementById('translate-button');
    var fileUpload = document.getElementById('file-upload');
    var translationResult = document.getElementById('translation-result');
    var targetLanguage = document.getElementById('target-language');
    var apiKeyInput = document.getElementById('api-key');
    var targetmodel = document.getElementById('target-model');

    const select = document.getElementById('target-language');
    languageData.forEach((lang) => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        select.appendChild(option);
    });

    translateButton.addEventListener('click', function() {
        var file = fileUpload.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            var text = event.target.result;
            var paragraphs = text.split("\n").filter(paragraph => paragraph.trim() !== "");
            var translatedParagraphs = [];

            paragraphs.forEach(function(paragraph, index) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://api.openai.com/v1/chat/completions");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Authorization", "Bearer " + apiKeyInput.value);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var response = JSON.parse(xhr.responseText);
                            var translation = response.choices[0].message.content;
                            translatedParagraphs[index] = translation;

                            if (translatedParagraphs.length === paragraphs.length && translatedParagraphs.every(Boolean)) {
                                var translatedText = translatedParagraphs.join("\n");
                                translationResult.innerHTML = translatedText;
                            }
                        } else {
                            var error = JSON.parse(xhr.responseText);
                            console.error("Error: " + error.error.message);
                        }
                    }
                };

                var language = targetLanguage.value;
                var model = targetmodel.value;
                var data = JSON.stringify({
                    "model": model,
                    "messages": [{"role": "user", "content": "Translate to " + language + ": {" + paragraph + "}"}]
                });

                xhr.send(data);
            });
        };

        reader.readAsText(file);
        var downloadButton = document.getElementById('download-button');
    });
    var downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', function() {
        // 獲取翻譯結果文本
        var translationText = translationResult.value;
        // 創建Blob對象
        var blob = new Blob([translationText], { type: 'text/plain' });
        // 創建URL
        var url = URL.createObjectURL(blob);
        // 創建<a>元素並設置屬性
        var a = document.createElement('a');
        a.href = url;
        a.download = 'translation.txt'; // 下載檔案的名稱
        // 模擬點擊<a>元素
        a.click();
        // 釋放URL對象
        URL.revokeObjectURL(url);
    });
});
