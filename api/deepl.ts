import { apikey } from "@/config/deepl.config"

export const DeepLTest = async () => {
    try {
        const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `DeepL-Auth-Key ${apikey}`
            },
            body: JSON.stringify({
                "text": ["Hello, world!"],
                "target_lang": "DE"
            })
        });
        const data = await response.json();
        console.log(data);
        const translatedText = data.translations[0].text;
        console.log(translatedText);
    } catch (error) {
        console.error(error);
    }
}

export const GetLanguagesList = async () => {
    try {
        const response = await fetch("https://api-free.deepl.com/v2/languages?type=target", {
            method: "GET",
            headers: {
                "Authorization": `DeepL-Auth-Key ${apikey}`
            }
        });
        const data = await response.json();
        return data.map((item: any) => ({ name: item.name, code: item.language }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const TranslateText = async (text: String, targetlanguage: String) => {
    try {
        const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `DeepL-Auth-Key ${apikey}`
            },
            body: JSON.stringify({
                "text": [
                    `${text}`
                ],
                "target_lang": `${targetlanguage}`
            })
        });
        const data = await response.json();
        const detectedSourceLanguage = data.translations[0].detected_source_language;
        const translatedText = data.translations[0].text;
        return { detectedSourceLanguage, translatedText };
    } catch (error) {
        console.error(error);
    }
}
