import { environment } from "@/config/environment";
import { API_ENDPOINTS } from "@/lib/constants";

// Nigerian banks with their settlement bank codes (fallback list)
export interface Bank {
  code: string;
  name: string;
}

export const NIGERIAN_BANKS: Bank[] = [
  { code: '044', name: 'Access Bank' },
  { code: '063', name: 'Access Bank (Diamond)' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Parallex Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'Suntrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank For Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
];

/**
 * Fetch banks from the 9jaCart payment/banks endpoint.
 * Returns a minimal { code, name } list and falls back to NIGERIAN_BANKS on error.
 */
export const fetchBanks = async (): Promise<Bank[]> => {
  try {
    const url = `${environment.apiBaseUrl}${API_ENDPOINTS.PAYMENT.BANKS}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: environment.basicAuthHeader,
      },
    });

    if (!response.ok) {
      // If the endpoint is unavailable, keep existing behaviour.
      console.error("Failed to fetch banks:", response.status, response.statusText);
      return NIGERIAN_BANKS;
    }

    const result: any = await response.json().catch(() => null);
    const data = Array.isArray(result?.data) ? result.data : [];

    if (!data.length) {
      return NIGERIAN_BANKS;
    }

    return data
      .map((item: any) => ({
        code: String(item.code ?? "").trim(),
        name: String(item.name ?? "").trim(),
      }))
      .filter((bank: Bank) => !!bank.code && !!bank.name);
  } catch (error) {
    console.error("Error fetching banks list:", error);
    return NIGERIAN_BANKS;
  }
};

/**
 * Search banks by name (case-insensitive)
 */
export const searchBanks = (query: string, banks: Bank[] = NIGERIAN_BANKS): Bank[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return banks.filter(bank =>
    bank.name.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get bank by code
 */
export const getBankByCode = (code: string): Bank | undefined => {
  return NIGERIAN_BANKS.find(bank => bank.code === code);
};

/**
 * Get bank by name (exact match, case-insensitive)
 */
export const getBankByName = (name: string): Bank | undefined => {
  return NIGERIAN_BANKS.find(
    bank => bank.name.toLowerCase() === name.toLowerCase()
  );
};




































