import { apikey } from "@/config/deepl.config"
import { useEffect, useState } from "react";

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

export const TranslateText = async (text: any, targetlanguage: any) => {
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

export const RetrieveLanguage = ({ onSelect }: any) => {
    const [languagesName, setLanguagesName] = useState<string[]>([]);
    const [languagesCode, setLanguagesCode] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const languages = await GetLanguagesList();
                setLanguagesName(languages.map(({ name }: any) => name));
                setLanguagesCode(languages.map(({ code }: any) => code));
            } catch (error) {
                console.error("Error fetching languages:", error);
            }
        })();
    }, []);

    return { languagesName, languagesCode };
};