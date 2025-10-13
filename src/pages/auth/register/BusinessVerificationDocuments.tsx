// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface BusinessVerificationDocumentsProps {
//   onNext?: (data: any) => void;
// }

// export default function BusinessVerificationDocuments({ onNext }: BusinessVerificationDocumentsProps) {
//   const [nationalId, setNationalId] = useState<File | null>(null);
//   const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleFileUpload = (type: 'nationalId' | 'businessCertificate') => (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (type === 'nationalId') {
//         setNationalId(file);
//       } else {
//         setBusinessCertificate(file);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const data = { nationalId, businessCertificate };
//       if (onNext) {
//         onNext(data);
//       } else {
//         // Navigate to success page
//         navigate('/register/success');
//       }
//     } catch (error) {
//       console.error('Submission failed:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSubmitting) {
//     return (
//       <div className="text-center space-y-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
//         <h2 className="text-xl font-semibold text-gray-900">Submitting for Verification</h2>
//         <p className="text-gray-600">Please wait while we process your documents.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* National ID Upload */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-2">
//             <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
//               <span className="text-2xl">+</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">Upload your National ID or Government ID</p>
//             </div>
//           </div>
//           <input
//             type="file"
//             accept=".pdf,.jpg,.jpeg,.png"
//             onChange={handleFileUpload('nationalId')}
//             className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//           />
//           {nationalId && (
//             <p className="text-sm text-green-600">✓ {nationalId.name} uploaded</p>
//           )}
//         </div>

//         {/* Business Certificate Upload */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-2">
//             <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
//               <span className="text-2xl">+</span>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">Business Registration Certificate</p>
//             </div>
//           </div>
//           <input
//             type="file"
//             accept=".pdf,.jpg,.jpeg,.png"
//             onChange={handleFileUpload('businessCertificate')}
//             className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//           />
//           {businessCertificate && (
//             <p className="text-sm text-green-600">✓ {businessCertificate.name} uploaded</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//         >
//           Submit for Verification
//         </button>
//       </form>

//       <div className="text-center text-xs text-gray-500">
//         By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRegistration } from '@/hooks/useRegistration';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { validateRegistrationDocuments } from '@/lib/registration.utils';

interface BusinessVerificationDocumentsProps {
  onNext?: (data: any) => void;
}

export default function BusinessVerificationDocuments({ onNext }: BusinessVerificationDocumentsProps) {
  const { 
    formData, 
    isLoading, 
    error, 
    submitStep3, 
    clearError 
  } = useRegistration();

  const [idDocument, setIdDocument] = useState<File | null>(formData.idDocument || null);
  const [businessRegCertificate, setBusinessRegCertificate] = useState<File | null>(formData.businessRegCertificate || null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Clear API errors when user changes files
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [idDocument, businessRegCertificate, clearError]);

  const validateDocuments = () => {
    const errors = validateRegistrationDocuments(idDocument, businessRegCertificate);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDocuments()) {
      return;
    }

    try {
      // Submit to API via registration store
      await submitStep3({
        emailAddress: formData.emailAddress || '',
        businessRegNumber: formData.businessRegNumber || '',
        storeName: formData.storeName || '',
        businessAddress: formData.businessAddress || '',
        taxIdNumber: formData.taxIdNumber || '',
        idDocument: idDocument!,
        businessRegCertificate: businessRegCertificate!,
      });

      // Success - navigate to success page
      toast.success("Registration completed successfully!");
      
      if (onNext) {
        onNext({ idDocument, businessRegCertificate });
      } else {
        navigate('/register/success');
      }
    } catch (error) {
      // Error is handled by the registration store
      console.error("Step 3 submission failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-900">Submitting for Verification</h2>
        <p className="text-gray-600">Please wait while we process your documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
        <p className="text-gray-600">Upload your verification documents to complete registration</p>
      </div>

      {error && <ErrorMessage message={error} />}
      
      {validationErrors.length > 0 && (
        <div className="space-y-1">
          {validationErrors.map((error, index) => (
            <ErrorMessage key={index} message={error} />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <DocumentUpload
          label="ID Document"
          file={idDocument}
          onFileChange={setIdDocument}
          accept="image/*,.pdf"
          required
        />

        <DocumentUpload
          label="Business Registration Certificate"
          file={businessRegCertificate}
          onFileChange={setBusinessRegCertificate}
          accept="image/*,.pdf"
          required
        />

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          disabled={!idDocument || !businessRegCertificate}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isLoading ? "Submitting..." : "Submit for Verification"}
        </LoadingButton>
      </form>

      <div className="text-center text-xs text-gray-500">
        By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
      </div>
    </div>
  );
}