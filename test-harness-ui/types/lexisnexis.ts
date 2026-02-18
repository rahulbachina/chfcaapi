// LexisNexis API Types
export enum RiskLevel {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    UNKNOWN = "UNKNOWN"
}

export enum ScreeningStatus {
    COMPLETED = "COMPLETED",
    PENDING = "PENDING",
    FAILED = "FAILED"
}

export enum MatchCategory {
    PEP = "PEP",
    SANCTIONS = "SANCTIONS",
    ADVERSE_MEDIA = "ADVERSE_MEDIA",
    FINANCIAL_REGULATOR = "FINANCIAL_REGULATOR",
    LAW_ENFORCEMENT = "LAW_ENFORCEMENT",
    OTHER = "OTHER"
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface Identifier {
    type: string;
    number: string;
    country?: string;
}

export interface PersonScreenRequest {
    referenceId: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
    dob?: string;
    nationality?: string;
    country?: string;
    address?: Address;
    identifiers?: Identifier[];
}

export interface EntityScreenRequest {
    referenceId: string;
    entityName: string;
    country?: string;
    registrationNumber?: string;
    address?: Address;
}

export interface MatchSource {
    listName: string;
    listType: string;
    country?: string;
}

export interface Match {
    matchId: string;
    score: number;
    name: string;
    aliases?: string[];
    categories: string[];
    riskLevel: RiskLevel;
    source: MatchSource;
    dob?: string;
    nationality?: string;
    description?: string;
    lastUpdated?: string;
}

export interface ScreeningResult {
    screeningId: string;
    referenceId: string;
    status: ScreeningStatus;
    subject: PersonScreenRequest | EntityScreenRequest;
    matches: Match[];
    matchCount: number;
    highestRiskLevel: RiskLevel;
    createdAt: string;
    processingTime?: number;
}

export interface BatchScreenRequest {
    persons?: PersonScreenRequest[];
    entities?: EntityScreenRequest[];
}

export interface BatchScreeningResult {
    batchId: string;
    totalScreened: number;
    results: ScreeningResult[];
    createdAt: string;
}
