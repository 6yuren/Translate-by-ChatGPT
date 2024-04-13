document.addEventListener('DOMContentLoaded', function() {
    var translateButton = document.getElementById('translate-button');
    var textToTranslate = document.getElementById('text-to-translate');
    var translationResult = document.getElementById('translation-result');
    // var targetLanguage = document.getElementById('target-language');
    var apiKeyInput = document.getElementById('api-key');
    var targetmodel = document.getElementById('target-model');
    var downloadButton = document.getElementById('download-button');

    // const select = document.getElementById('target-language');
    // languageData.forEach((lang) => {
    //     const option = document.createElement('option');
    //     option.value = lang.code;
    //     option.textContent = lang.name;
    //     select.appendChild(option);
    // });

    translateButton.addEventListener('click', function() {
        var text = textToTranslate.value;
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

            // var language = "繁體中文" /*targetLanguage.value*/;
            var model = targetmodel.value;
            var data = JSON.stringify({
                "model": model,
                "messages": [{"role": "user", "content": "請以繁體中文與台灣用語翻譯: {" + paragraph + "}"}]
            });

            xhr.send(data);
        });
    });

    // 添加下載按鈕的點擊事件
    downloadButton.addEventListener('click', function() {
        var translationText = translationResult.value;
        var blob = new Blob([translationText], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'translation.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});
