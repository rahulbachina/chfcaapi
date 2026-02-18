import axios from 'axios';
import type {
    PersonScreenRequest,
    EntityScreenRequest,
    ScreeningResult,
    BatchScreenRequest,
    BatchScreeningResult,
} from '../types/lexisnexis';

const API_BASE_URL = 'http://localhost:8002';

const lexisNexisApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const screenPerson = async (
    request: PersonScreenRequest
): Promise<ScreeningResult> => {
    const response = await lexisNexisApi.post<ScreeningResult>(
        '/api/v1/screen/person',
        request
    );
    return response.data;
};

export const screenEntity = async (
    request: EntityScreenRequest
): Promise<ScreeningResult> => {
    const response = await lexisNexisApi.post<ScreeningResult>(
        '/api/v1/screen/entity',
        request
    );
    return response.data;
};

export const batchScreen = async (
    request: BatchScreenRequest
): Promise<BatchScreeningResult> => {
    const response = await lexisNexisApi.post<BatchScreeningResult>(
        '/api/v1/screen/batch',
        request
    );
    return response.data;
};
