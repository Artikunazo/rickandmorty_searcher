import { ApiRickAndMortyResultsResponse } from './result-api.type';

export interface ApiRickAndMortyInfoResponse {
    count: number;
    pages: number;
    next: string;
    prev: string;
}

export interface ApiRickAndMortyResponse {
    info: ApiRickAndMortyInfoResponse;
    results: ApiRickAndMortyResultsResponse[]
}