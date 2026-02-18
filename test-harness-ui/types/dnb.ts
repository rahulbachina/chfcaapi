// D&B API Types
export interface DNBSearchRequest {
  subject_name: string;
  country_iso_code: string;
  territory_name?: string;
  match_type?: string;
}

export interface DNBOrganizationPrimaryName {
  OrganizationName: string;
}

export interface DNBOrganizationName {
  OrganizationPrimaryName: DNBOrganizationPrimaryName[];
}

export interface DNBPrimaryAddress {
  StreetAddressLine?: Array<{ LineText: string }>;
  PrimaryTownName?: string;
  CountryISOAlpha2Code?: string;
  PostalCode?: string;
  TerritoryAbbreviatedName?: string;
}

export interface DNBOrganization {
  DUNSNumber: string;
  OrganizationName: DNBOrganizationName;
  PrimaryAddress: DNBPrimaryAddress;
  MatchQualityInformation?: any;
}

export interface DNBMatchCandidate {
  Organization: DNBOrganization;
  MatchGrade?: string;
  ConfidenceCode?: number;
}

export interface DNBTransactionDetail {
  ApplicationTransactionID: string;
  ServiceTransactionID: string;
  TransactionTimestamp: string;
}

export interface DNBTransactionResult {
  SeverityText?: string;
  ResultID: string;
  ResultText: string;
  ResultMessage?: any;
}

export interface DNBMatchResponse {
  TransactionDetail: DNBTransactionDetail;
  TransactionResult: DNBTransactionResult;
  MatchCandidate?: DNBMatchCandidate[];
}

export interface DNBTelecommunication {
  TelecommunicationNumber: string;
  TelecommunicationNumberType?: string;
}

export interface DNBFinancialStatement {
  StatementDate?: string;
  Currency?: string;
  Revenue?: number;
  NetIncome?: number;
  TotalAssets?: number;
}

export interface DNBCompanyProfile {
  DUNSNumber: string;
  OrganizationName: DNBOrganizationName;
  PrimaryAddress: DNBPrimaryAddress;
  Telecommunication?: DNBTelecommunication[];
  EmployeeQuantity?: number;
  SalesRevenueAmount?: number;
  StockExchangeDetails?: any;
  FinancialStatement?: DNBFinancialStatement[];
  BusinessDescription?: string;
  OperatingStatusText?: string;
  StartDate?: string;
}

export interface DNBCompanyProfileResponse {
  TransactionDetail: DNBTransactionDetail;
  TransactionResult: DNBTransactionResult;
  Organization: DNBCompanyProfile;
}

export interface DNBBalanceSheet {
  TotalAssets?: number;
  TotalLiabilities?: number;
  NetWorth?: number;
  CurrentAssets?: number;
  CurrentLiabilities?: number;
}

export interface DNBIncomeStatement {
  Revenue?: number;
  GrossProfit?: number;
  OperatingIncome?: number;
  NetIncome?: number;
  EBITDA?: number;
}

export interface DNBFinancialStatementDetail {
  StatementDate: string;
  Currency: string;
  BalanceSheet?: DNBBalanceSheet;
  IncomeStatement?: DNBIncomeStatement;
  FiscalYear?: number;
}

export interface DNBFinancialStatementsResponse {
  TransactionDetail: DNBTransactionDetail;
  TransactionResult: DNBTransactionResult;
  DUNSNumber: string;
  FinancialStatements: DNBFinancialStatementDetail[];
}

export interface DNBRiskScore {
  ScoreType: string;
  ScoreValue: number;
  ScoreDate: string;
  RiskLevel: string;
  ScoreDescription?: string;
}

export interface DNBPredictiveIndicator {
  IndicatorType: string;
  IndicatorValue: string | number;
  IndicatorDescription?: string;
}

export interface DNBAnalyticsResponse {
  TransactionDetail: DNBTransactionDetail;
  TransactionResult: DNBTransactionResult;
  DUNSNumber: string;
  RiskScores: DNBRiskScore[];
  PredictiveIndicators?: DNBPredictiveIndicator[];
}
