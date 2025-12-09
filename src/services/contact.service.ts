import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ContactAdminPayload, ContactAdminResponse } from "@/types";

export class ContactService {
  async contactAdmin(payload: ContactAdminPayload): Promise<ContactAdminResponse> {
    try {
      const response = await apiClient.post<ContactAdminResponse>(
        API_ENDPOINTS.VENDOR.CONTACT_ADMIN,
        payload,
        { requiresAuth: true }
      );

      if (response.error || !response.data) {
        throw new Error(
          response.message || "Failed to send message to admin"
        );
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message to admin";
      throw new Error(errorMessage);
    }
  }
}

export const contactService = new ContactService();



