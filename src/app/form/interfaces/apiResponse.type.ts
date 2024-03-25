export interface ApiResponse {
    placeId: string;
    queryType: string;
    receptionTime: String;
    refs: Array<string>;
    reportTime: String;
    reportType: String;
    revision: String;
    stationId: String;
    text: String;
    textHTML: String;
    validFrom?: String;
    validTo?: String;
}
