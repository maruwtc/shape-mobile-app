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

interface Language {
    name: string;
    // Add other properties if necessary
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