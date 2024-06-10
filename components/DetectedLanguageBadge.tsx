import React from 'react';
import { Badge } from 'react-native-paper';

interface DetectedLanguageBadgeProps {
    detectedLanguage: string;
}

const DetectedLanguageBadge: React.FC<DetectedLanguageBadgeProps> = ({ detectedLanguage }) => {
    return (
        <Badge className="text-inherit bg-transparent text-teal-500">
            {detectedLanguage ? `Detected Language: ${detectedLanguage}` : "Detected Language: Waiting for input..."}
        </Badge>
    );
};

export default DetectedLanguageBadge;
