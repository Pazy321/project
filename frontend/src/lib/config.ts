

export interface Config {
    API_BASE: string;
}

export const config: Config = {
    API_BASE: import.meta.env.VITE_API_URL ?? '/api',
};
