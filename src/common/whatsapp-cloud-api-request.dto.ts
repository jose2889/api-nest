export interface WhatsappCloudApiRequest {
    messaging_product: string;
    to:                string;
    type:              string;
    template:          Template;
}

export interface Template {
    name:       string;
    language:   Language;
    components: Component[];
}

export interface Component {
    type:       string;
    sub_type?:       string;
    index?:       number;
    parameters: Parameter[];
}

export interface Parameter {
    type:       string;
    image?:     Image;
    document?:  Document;
    video?:     Video;
    text?:      string;
    payload?:   string; 
    dateTime?: DateTime;
    currency?:  Currency;
}

export interface DateTime {
    fallback_value: string;
    day_of_month:   number;
    year:           number;
    month:          number;
    hour:           number;
    minute:         number;
}

export interface Currency {
    fallback_value: string;
    code:           string;
    amount_1000:    number;
}

export interface Image {
    link: string;
}

export interface Video {
    link: string;
}

export interface Document {
    link: string;
    filename: string;
}

export interface Language {
    code: string;
}

export let dataApiRequest: WhatsappCloudApiRequest = {
    "messaging_product": "whatsapp",
    "to": "",
    "type": "template",
    "template": {
        "name": "confirmacion_reserva",
        "language": {
            "code": "es"
        },
        "components": [{
            "type" : "body",
            "parameters": [
                {
                    "type": "text",
                    "text": "", 
                },
                {
                    "type": "text",
                    "text": ""
                },
                {
                    "type": "text",
                    "text": ""
                }
               
            ]
        },
        {
            "type": "button",
            "sub_type": "quick_reply",
            "index": 0,
            "parameters": 
            [{
                "type": "payload",
                "payload": "lo estamos logrando"
            }]
        }]
    }
}
