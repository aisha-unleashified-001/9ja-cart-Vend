import { useState, useEffect } from 'react';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { contactService } from '@/services/contact.service';
import { popup } from '@/lib/popup';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Send, Loader2 } from 'lucide-react';

export default function ContactAdminPage() {
  const { profile, isLoading: isLoadingProfile, fetchProfile } = useVendorProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  // Fetch profile data on component mount
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // Pre-fill form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.account.fullName || '',
        storeName: profile.business.storeName || '',
        email: profile.account.emailAddress || '',
        phoneNumber: profile.account.phoneNumber || '',
        subject: '',
        message: '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await contactService.contactAdmin({
        name: formData.name,
        storeName: formData.storeName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject,
        message: formData.message,
      });

      popup.success('Message sent successfully! The admin will get back to you soon.');
      
      // Reset form (keep pre-filled fields)
      setFormData({
        name: profile?.account.fullName || '',
        storeName: profile?.business.storeName || '',
        email: profile?.account.emailAddress || '',
        phoneNumber: profile?.account.phoneNumber || '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      popup.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Admin</h1>
          <p className="text-muted-foreground">
            Get in touch with the admin team for support and inquiries.
          </p>
        </div>
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact Admin</h1>
        <p className="text-muted-foreground">
          Get in touch with the admin team for support and inquiries.
        </p>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pre-filled Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground cursor-not-allowed opacity-70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={formData.storeName}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground cursor-not-allowed opacity-70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                disabled
                className="w-full px-3 py-2 border border-border rounded-md bg-muted text-foreground cursor-not-allowed opacity-70"
              />
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              required
              disabled={isSubmitting}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your message"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



