import dotenv from 'dotenv';

export const environment = process.env.TEST_ENV ?? 'main';
if (environment !== 'main' && environment !== 'buggy') {
    throw new Error('TEST_ENV must be main or buggy.');
}

dotenv.config({ path: `.env.${environment}`, quiet: true });

function required(name: string): string {
    const value = process.env[name];
    if (!value?.trim()) {
        throw new Error(`Missing ${name}. Set it or copy .env.example to .env.${environment}.`);
    }
    return value;
}

function requiredUrl(name: string): string {
    const value = required(name);
    try {
        const url = new URL(value);
        if (url.protocol === 'http:' || url.protocol === 'https:') return value.replace(/\/$/, '');
    } catch {
        // Report the variable name without exposing the configured value.
    }
    throw new Error(`${name} must be a valid HTTP(S) URL.`);
}

export const config = {
    baseUrl: requiredUrl('BASE_URL'),
    apiUrl: requiredUrl('API_URL'),
    get userEmail() { return required('USER_EMAIL'); },
    get userPassword() { return required('USER_PASSWORD'); },
    purchaseProduct: process.env.PURCHASE_PRODUCT?.trim() || 'Pliers',
    userDisplayName: process.env.USER_DISPLAY_NAME?.trim() || 'Jack Howe',
};
