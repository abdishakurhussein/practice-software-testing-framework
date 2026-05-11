declare const process: {
    env: {
        BASE_URL: string;
        API_URL: string;
        USER_EMAIL: string;
        USER_PASSWORD: string;
    };
};

export const config = {
    baseUrl: process.env.BASE_URL!,
    apiUrl: process.env.API_URL!,
    userEmail: process.env.USER_EMAIL!,
    userPassword: process.env.USER_PASSWORD!
};