import axios from "axios";

const baseURL = (): string => {
    if (process.env.NODE_ENV === 'development') {
        const port = process.env.EXPRESS_PORT || 3001;
        return `http://localhost:${port}/api`;
    }
    return '/api';
}

export const api = axios.create({
    baseURL: baseURL(),
});