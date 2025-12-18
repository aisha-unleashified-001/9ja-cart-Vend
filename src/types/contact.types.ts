export interface ContactAdminPayload {
  subject: string;
  message: string;
}

export interface ContactAdminResponse {
  status: number;
  error: boolean;
  message: string;
  data?: {
    id?: string;
    [key: string]: unknown;
  };
}

// Contact form types
export interface ContactFormData {
  fullName: string;
  emailAddress: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  fullName?: string;
  emailAddress?: string;
  subject?: string;
  message?: string;
}

export interface ContactSubmissionState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  message?: string;
}

// Submit contact form function
export async function submitContact(
  data: ContactFormData
): Promise<ContactSubmissionResult> {
  try {
    const { contactService } = await import("@/services/contact.service");
    const response = await contactService.contactAdmin({
      subject: data.subject,
      message: `From: ${data.fullName} (${data.emailAddress})\n\n${data.message}`,
    });

    if (response.error) {
      return {
        success: false,
        message: response.message || "Failed to send message. Please try again.",
      };
    }

    return {
      success: true,
      message: response.message || "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again later.",
    };
  }
}



