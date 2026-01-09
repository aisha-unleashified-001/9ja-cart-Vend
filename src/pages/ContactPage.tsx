import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Alert } from "../components/ui/alert";
import { Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { submitContact, type ContactFormData, type ContactFormErrors, type ContactSubmissionState } from "@/types";
import { validateContactField, validateContactForm } from "@/types/validation";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/homepage/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    emailAddress: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submissionState, setSubmissionState] = useState<ContactSubmissionState>({
    status: "idle",
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (errors[name as keyof ContactFormErrors]) {
      const fieldError = validateContactField(name, value);
      setErrors((prev: ContactFormErrors) => ({
        ...prev,
        [name]: fieldError || undefined,
      }));
    }
  };

  const handleFieldBlur = useCallback((fieldName: string, value: string) => {
    const fieldError = validateContactField(fieldName, value);
    setErrors((prev: ContactFormErrors) => ({
      ...prev,
      [fieldName]: fieldError || undefined,
    }));
  }, []);

  const validateForm = (): boolean => {
    const formErrors = validateContactForm(formData);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmissionState({
        status: "error",
        message: "Please fix the errors above before submitting.",
      });
      return;
    }

    setSubmissionState({ status: "submitting" });

    try {
      const result = await submitContact(formData);

      if (result.success) {
        setSubmissionState({
          status: "success",
          message: result.message || "Thank you for your message! We'll get back to you soon.",
        });
        
        // Reset form on success
        setFormData({
          fullName: "",
          emailAddress: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setSubmissionState({
          status: "error",
          message: result.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmissionState({
        status: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
      console.error(error)
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <motion.main
        id="main-content"
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex justify-center mb-8">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">9J</span>
                </div>
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our platform? Want to learn more about
              becoming a vendor? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Success Message */}
                  {submissionState.status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <Alert variant="default" className="border-green-200 bg-green-50">
                        {/* <CheckCircle className="h-4 w-4 text-green-600" /> */}
                        🎉
                        <div className="ml-2">
                          <h4 className="font-semibold text-green-800">Message Sent Successfully!</h4>
                          <p className="text-sm text-green-700 mt-1">
                            {submissionState.message}
                          </p>
                        </div>
                      </Alert>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {submissionState.status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <div className="ml-2">
                          <h4 className="font-semibold">Failed to Send Message</h4>
                          <p className="text-sm mt-1">
                            {submissionState.message}
                          </p>
                        </div>
                      </Alert>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={(e) => handleFieldBlur("fullName", e.target.value)}
                        className={errors.fullName ? "border-destructive focus:border-destructive" : ""}
                        disabled={submissionState.status === "submitting"}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailAddress">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        onBlur={(e) => handleFieldBlur("emailAddress", e.target.value)}
                        className={errors.emailAddress ? "border-destructive focus:border-destructive" : ""}
                        disabled={submissionState.status === "submitting"}
                        required
                      />
                      {errors.emailAddress && (
                        <p className="text-sm text-destructive mt-1" role="alert">
                          {errors.emailAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("subject", e.target.value)}
                      className={errors.subject ? "border-destructive focus:border-destructive" : ""}
                      disabled={submissionState.status === "submitting"}
                      required
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={(e) => handleFieldBlur("message", e.target.value)}
                      rows={6}
                      className={`resize-none ${errors.message ? "border-destructive focus:border-destructive" : ""}`}
                      disabled={submissionState.status === "submitting"}
                      required
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submissionState.status === "submitting" || submissionState.status === "success"}
                  >
                    {submissionState.status === "submitting" ? (
                      <>
                        <motion.div
                          className="mr-2 inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending Message...
                      </>
                    ) : submissionState.status === "success" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="bg-card rounded-xl shadow-sm border p-6 md:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Email
                      </h3>
                      <p className="text-muted-foreground">info@9jacart.ng</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Location
                      </h3>
                      <p className="text-muted-foreground">
                        Connecting artisans across Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Response Time
                      </h3>
                      <p className="text-muted-foreground">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 md:p-8">
                <h3 className="font-semibold text-accent-foreground mb-3">
                  Quick Questions?
                </h3>
                <p className="text-sm text-accent-foreground/80 mb-4">
                  Check out our frequently asked questions for instant answers
                  to common inquiries.
                </p>
            
                <Link to="/#faq">
                  <Button variant="outline" className="w-full">
                    View FAQ
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          {/* Vendor Interest */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8">
            <h3 className="font-semibold text-primary mb-3">
              Interested in Becoming a Vendor?
            </h3>
            <p className="text-sm text-primary/80 mb-4">
              Join our waitlist to be notified when vendor registration opens.
            </p>
            <Link to="/vendor-form">
              <Button className="w-full">Join Vendor Waitlist</Button>
            </Link>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default ContactPage;
