import { apikey } from "@/config/replicate.config";

export const CreateSpeechToTextPrediction = async (audio: any) => {
    const data = {
        "version": "3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
        "input": {
            "task": "transcribe",
            "audio": audio,
            "language": "None",
            "timestamp": "chunk",
            "batch_size": 64,
            "diarise_audio": false
        }
    };
    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        console.log("Prediction created:", result);
        const geturl = result.urls.get;
        const cancelurl = result.urls.cancel;
        return { geturl, cancelurl };
    } catch (error) {
        console.error("Error creating prediction:", error);
        throw new Error("Failed to create prediction");
    }
}

export const GetSpeechToTextPredictionResult = async (geturl: string) => {
    try {
        const response = await fetch(geturl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching prediction result:", error);
        throw new Error("Failed to fetch prediction result");
    }
}

export const CacnelSpeechToTextPrediction = async (cancelurl: string) => {
    try {
        const response = await fetch(cancelurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return;
    } catch (error) {
        console.error("Error cancelling prediction:", error);
        throw new Error("Failed to cancel prediction");
    }
}

export const CreateImageToTextPrediction = async (image: any) => {
    const data = {
        "version": "a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61",
        "input": {
            "image": image,
        }
    };
    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        console.log("Prediction created:", result);
        const geturl = result.urls.get;
        const cancelurl = result.urls.cancel;
        return { geturl, cancelurl };
    } catch (error) {
        console.error("Error creating prediction:", error);
        throw new Error("Failed to create prediction");
    }
}

export const GetImageToTextPredictionResult = async (geturl: string) => {
    try {
        const response = await fetch(geturl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching prediction result:", error);
        throw new Error("Failed to fetch prediction result");
    }
}

export const CacnelImageToTextPrediction = async (cancelurl: string) => {
    try {
        const response = await fetch(cancelurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return;
    } catch (error) {
        console.error("Error cancelling prediction:", error);
        throw new Error("Failed to cancel prediction");
    }
}