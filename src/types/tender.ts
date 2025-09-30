export interface Tender {
  number: string;
  title: string;
  contact: string;
  status: string;
  time_left: string;
  close_date: string;
  all_responses: string;
  company_responses: string;
  url: string;
}

export interface TenderResponse {
  results: Tender[];
}
