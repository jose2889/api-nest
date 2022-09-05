export interface WhatsappCloudAPIRequest {
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
    parameters: Parameter[];
}

export interface Parameter {
    type: string;
    text: string;
}

export interface Language {
    code: string;
}

export interface WhatsappNotificationRequest {
    phoneNumber:        string;
    customerName:       string;
    businessName:       string;
    date:               string;
    businessWbsite:     string;
}

export interface WhatsappConfimationRequest {
    phoneNumber:    string;
    customerName:   string;
    businessName:   string;
    confirmToken:   string;
    cancelToken:    string;
    date:           string;
}