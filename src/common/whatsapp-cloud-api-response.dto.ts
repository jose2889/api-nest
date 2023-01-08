
export interface WhatsappCloudAPIResponse {
    messaging_product: string;
    contacts:          Contact[];
    messages:          Message[];
}

export interface Contact {
    input: string;
    wa_id: string;
}

export interface Message {
    id: string;
}

export let responseWhatsappTemplate : WhatsappCloudAPIResponse =
    {
        "messaging_product": "whatsapp",
        "contacts": [
            {
            "input": "",
            "wa_id": ""
            }
        ],
        "messages": [
            {
            "id": ""
            }
    ]
    }