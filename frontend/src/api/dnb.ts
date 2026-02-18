import axios from 'axios';
import type {
    DNBMatchResponse,
    DNBCompanyProfileResponse,
    DNBFinancialStatementsResponse,
    DNBAnalyticsResponse,
} from '../types/dnb';

const API_BASE_URL = 'http://localhost:8001';

const dnbApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchCompanies = async (
    subjectName: string,
    countryIsoCode: string = '',
    territoryName?: string,
    matchType: string = 'Advanced'
): Promise<DNBMatchResponse> => {
    const params = new URLSearchParams({
        subject_name: subjectName,
        match_type: matchType,
    });

    if (countryIsoCode) {
        params.append('country_iso_code', countryIsoCode);
    }

    if (territoryName) {
        params.append('territory_name', territoryName);
    }

    const response = await dnbApi.get<any>(
        `/api/v1/companies/search?${params.toString()}`
    );

    // Handle nested MatchResponse structure from API
    if (response.data.MatchResponse) {
        return response.data.MatchResponse;
    }

    return response.data;
};

export const getCompanyProfile = async (
    duns: string,
    productCode: string = 'DCP_STD'
): Promise<DNBCompanyProfileResponse> => {
    const response = await dnbApi.get<any>(
        `/api/v1/companies/${duns}/profile`,
        { params: { product_code: productCode } }
    );

    // Handle nested OrderProductResponse structure from API/Mock
    if (response.data.OrderProductResponse) {
        const detail = response.data.OrderProductResponse.OrderProductResponseDetail;
        const product = detail.Product;

        return {
            TransactionDetail: response.data.OrderProductResponse.TransactionDetail,
            TransactionResult: response.data.OrderProductResponse.TransactionResult,
            Organization: product.Organization
        };
    }

    return response.data;
};

export const getFinancialStatements = async (
    duns: string
): Promise<DNBFinancialStatementsResponse> => {
    const response = await dnbApi.get<DNBFinancialStatementsResponse>(
        `/api/v1/companies/${duns}/financials`
    );
    return response.data;
};

export const getAnalytics = async (
    duns: string
): Promise<DNBAnalyticsResponse> => {
    const response = await dnbApi.get<DNBAnalyticsResponse>(
        `/api/v1/companies/${duns}/analytics`
    );
    return response.data;
};
