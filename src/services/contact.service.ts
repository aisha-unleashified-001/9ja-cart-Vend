import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ContactAdminPayload, ContactAdminResponse, ContactFormData } from "@/types";

export class ContactService {
  async contactAdmin(payload: ContactAdminPayload): Promise<ContactAdminResponse> {
    try {
      // The API endpoint doesn't return a response body, so we use void as the generic type
      const response = await apiClient.post<void>(
        API_ENDPOINTS.VENDOR.CONTACT_ADMIN,
        payload,
        { requiresAuth: true }
      );

      // The API may not return a response body, so we check for errors
      if (response.error) {
        throw new Error(
          response.message || "Failed to send message to admin"
        );
      }

      // Return success response since API doesn't return a body
      return {
        status: response.status || 200,
        error: false,
        message: response.message || "Message sent successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message to admin";
      throw new Error(errorMessage);
    }
  }

  async contactPublic(payload: ContactFormData): Promise<ContactAdminResponse> {
    try {
      // The public contact endpoint uses /vendor/contact with Basic Auth only
      const response = await apiClient.post<void>(
        "/vendor/contact",
        payload,
        { requiresAuth: false }
      );

      // The API may not return a response body, so we check for errors
      if (response.error) {
        throw new Error(
          response.message || "Failed to send message"
        );
      }

      // Return success response since API doesn't return a body
      return {
        status: response.status || 200,
        error: false,
        message: response.message || "Message sent successfully",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message";
      throw new Error(errorMessage);
    }
  }
}

export const contactService = new ContactService();






