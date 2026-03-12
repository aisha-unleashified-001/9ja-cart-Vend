import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { popup } from '@/lib/popup';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import DocumentViewerModal from '@/components/document/DocumentViewerModal';
import { fetchBanks, searchBanks, type Bank } from '@/lib/banks.data';
import { STORAGE_KEYS } from '@/lib/constants';
import type { VendorProfile } from '@/types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, isLoading, error, fetchProfile, updateProfile, updateAccountInfo, changePassword, setSecurityPin, enable2FA, disable2FA } = useVendorProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorProfile>>({});
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false);
  const [accountInfoForm, setAccountInfoForm] = useState<{
    accountNumber: string;
    bank: string;
    settlementBank: string;
    settlementBankName: string;
    securityPin: string;
  }>({
    accountNumber: '',
    bank: '',
    settlementBank: '',
    settlementBankName: '',
    securityPin: '',
  });
  const [showAccountInfoSecurityPin, setShowAccountInfoSecurityPin] = useState(false);
  const [allBanks, setAllBanks] = useState<Bank[]>([]);
  const [bankSuggestions, setBankSuggestions] = useState<Bank[]>([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const bankSuggestionsRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isHoveringDialog, setIsHoveringDialog] = useState(false);
  const [documentViewer, setDocumentViewer] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabledState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.VENDOR_2FA_ENABLED) === 'true'
  );
  const setIsTwoFactorEnabled = (enabled: boolean) => {
    setIsTwoFactorEnabledState(enabled);
    localStorage.setItem(STORAGE_KEYS.VENDOR_2FA_ENABLED, String(enabled));
  };
  const [hasPinSet, setHasPinSet] = useState(true);
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [twoFactorPopupMode, setTwoFactorPopupMode] = useState<'setup' | 'verify-enable' | 'verify-disable'>('setup');
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [is2FASubmitting, setIs2FASubmitting] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch banks from same endpoint as registration
  useEffect(() => {
    let isMounted = true;
    fetchBanks()
      .then((banks) => {
        if (isMounted) setAllBanks(banks);
      })
      .catch((err) => console.error('Failed to load banks:', err));
    return () => { isMounted = false; };
  }, []);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(profile);
      const bankVal = profile.accountInfo?.bank || '';
      const banks = allBanks.length ? allBanks : [];
      const resolved = banks.find(
        (b) => b.code === bankVal || b.name.toLowerCase() === bankVal.toLowerCase()
      );
      setAccountInfoForm({
        accountNumber: profile.accountInfo?.accountNumber || '',
        bank: resolved ? resolved.name : bankVal,
        settlementBank: resolved?.code || '',
        settlementBankName: resolved?.name || bankVal || '',
        securityPin: '',
      });
    }
  }, [profile, allBanks]);

  // Close bank suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showBankSuggestions &&
        bankSuggestionsRef.current &&
        !bankSuggestionsRef.current.contains(e.target as Node) &&
        bankInputRef.current &&
        !bankInputRef.current.contains(e.target as Node)
      ) {
        setShowBankSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBankSuggestions]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'account-info', name: 'Account Information', icon: '🏦' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ];

  const handleEdit = () => {
    // Account info tab is read-only, don't allow editing
    if (activeTab === 'account-info') {
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData(profile);
    }
  };

  const handleEditAccountInfo = () => {
    if (!profile) return;
    const bankVal = profile.accountInfo?.bank || '';
    const banks = allBanks.length ? allBanks : [];
    const resolved = banks.find(
      (b) => b.code === bankVal || b.name.toLowerCase() === bankVal.toLowerCase()
    );
    setAccountInfoForm({
      accountNumber: profile.accountInfo?.accountNumber || '',
      bank: resolved ? resolved.name : bankVal,
      settlementBank: resolved?.code || '',
      settlementBankName: resolved?.name || bankVal || '',
      securityPin: '',
    });
    setIsEditingAccountInfo(true);
  };

  const handleCancelAccountInfo = () => {
    if (profile) {
      const bankVal = profile.accountInfo?.bank || '';
      const banks = allBanks.length ? allBanks : [];
      const resolved = banks.find(
        (b) => b.code === bankVal || b.name.toLowerCase() === bankVal.toLowerCase()
      );
      setAccountInfoForm({
        accountNumber: profile.accountInfo?.accountNumber || '',
        bank: resolved ? resolved.name : bankVal,
        settlementBank: resolved?.code || '',
        settlementBankName: resolved?.name || bankVal || '',
        securityPin: '',
      });
    }
    setShowBankSuggestions(false);
    setIsEditingAccountInfo(false);
  };

  const handleBankInputChange = (value: string) => {
    setAccountInfoForm((prev) => ({ ...prev, bank: value }));
    if (value.trim()) {
      const suggestions = searchBanks(value, allBanks.length ? allBanks : undefined);
      setBankSuggestions(suggestions);
      setShowBankSuggestions(suggestions.length > 0);
    } else {
      setBankSuggestions([]);
      setShowBankSuggestions(false);
      setAccountInfoForm((prev) => ({ ...prev, settlementBank: '', settlementBankName: '' }));
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setAccountInfoForm({
      ...accountInfoForm,
      bank: bank.name,
      settlementBank: bank.code,
      settlementBankName: bank.name,
    });
    setShowBankSuggestions(false);
    setBankSuggestions([]);
  };

  const handleSaveAccountInfo = async () => {
    const acct = accountInfoForm.accountNumber.trim();
    const pin = accountInfoForm.securityPin.trim();
    if (!acct || !accountInfoForm.settlementBank || !accountInfoForm.settlementBankName) {
      popup.error('Please fill in account number and select a bank from the list.');
      return;
    }
    if (acct.length !== 10 || !/^\d+$/.test(acct)) {
      popup.error('Account number must be exactly 10 digits.');
      return;
    }
    if (!pin || !/^\d{6}$/.test(pin)) {
      popup.error('Please enter your 6-digit security PIN.');
      return;
    }
    try {
      await updateAccountInfo({
        accountNumber: acct,
        settlementBank: accountInfoForm.settlementBank,
        settlementBankName: accountInfoForm.settlementBankName,
        securityPin: pin,
      });
      popup.success('Account information updated successfully!');
      setIsEditingAccountInfo(false);
    } catch (error) {
      console.error('Failed to update account information:', error);
      const msg = error instanceof Error ? error.message : '';
      const needsSetup =
        msg.toLowerCase().includes('security') &&
        msg.toLowerCase().includes('pin') &&
        (msg.toLowerCase().includes('required') ||
          msg.toLowerCase().includes('not found') ||
          msg.toLowerCase().includes('invalid') ||
          msg.toLowerCase().includes('set up'));
      if (needsSetup) {
        popup.warning(
          'Please set up your security PIN by enabling 2FA in the Security tab before updating your account information.'
        );
      } else {
        popup.error(msg || 'Failed to update account information. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      // Account info tab is read-only, so this should only handle profile/business updates
      await updateProfile(formData);
      popup.success('Profile updated successfully!');
      setIsEditing(false);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Failed to save:', error);
      popup.error('Failed to update profile. Please try again.');
    }
  };

  const handleConfirmSave = () => {
    handleSave();
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleOpenChangePassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowChangePasswordDialog(true);
  };

  const handle2FAToggleClick = () => {
    setPinValue('');
    setConfirmPinValue('');
    setShowPin(false);
    setShowConfirmPin(false);
    if (isTwoFactorEnabled) {
      setTwoFactorPopupMode('verify-disable');
    } else {
      setTwoFactorPopupMode(hasPinSet ? 'verify-enable' : 'setup');
    }
    setShow2FAPopup(true);
  };

  const handleCloseChangePassword = () => {
    if (isChangingPassword) return;
    setShowChangePasswordDialog(false);
  };

  const handleClose2FAPopup = () => {
    if (is2FASubmitting) return;
    setShow2FAPopup(false);
  };

  const handleSubmitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      popup.error('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      popup.error('New password and confirmation do not match.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      popup.success('Password changed successfully.');
      setShowChangePasswordDialog(false);
      // Optionally refresh profile so "Last updated" reflects latest change
      fetchProfile();
    } catch (err) {
      console.error('Failed to change password:', err);
      popup.error(
        err instanceof Error ? err.message : 'Failed to change password. Please try again.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmit2FAPopup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (twoFactorPopupMode === 'setup') {
      if (!pinValue || !confirmPinValue) {
        popup.error('Please enter and confirm your 6-digit PIN.');
        return;
      }
      if (!/^\d{6}$/.test(pinValue)) {
        popup.error('PIN must be exactly 6 digits.');
        return;
      }
      if (pinValue !== confirmPinValue) {
        popup.error('PIN and confirmation PIN do not match.');
        return;
      }
      try {
        setIs2FASubmitting(true);
        await setSecurityPin(pinValue);
        await enable2FA(pinValue);
        setHasPinSet(true);
        setIsTwoFactorEnabled(true);
        popup.success('Two-step verification enabled successfully.');
        setShow2FAPopup(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        if (msg.toLowerCase().includes('already exists')) {
          setHasPinSet(true);
          try {
            await enable2FA(pinValue);
            setIsTwoFactorEnabled(true);
            popup.success('2FA enabled successfully.');
          } catch (e2) {
            const m2 = e2 instanceof Error ? e2.message : String(e2);
            if (m2.toLowerCase().includes('already enabled')) {
              setIsTwoFactorEnabled(true);
              popup.success('2FA is already enabled for your account.');
            } else {
              popup.error(m2 || 'Failed to enable 2FA.');
            }
          }
          setShow2FAPopup(false);
        } else {
          popup.error(msg || 'Failed to set up 2FA. Please try again.');
        }
      } finally {
        setIs2FASubmitting(false);
      }
      return;
    }

    if (twoFactorPopupMode === 'verify-enable') {
      if (!pinValue || !/^\d{6}$/.test(pinValue)) {
        popup.error('Please enter your 6-digit security PIN.');
        return;
      }
      try {
        setIs2FASubmitting(true);
        await enable2FA(pinValue);
        setIsTwoFactorEnabled(true);
        popup.success('Two-step verification enabled successfully.');
        setShow2FAPopup(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        if (msg.toLowerCase().includes('already enabled')) {
          setIsTwoFactorEnabled(true);
          setShow2FAPopup(false);
          popup.success('2FA is already enabled for your account.');
        } else {
          popup.error(msg || 'Failed to enable 2FA. Please try again.');
        }
      } finally {
        setIs2FASubmitting(false);
      }
      return;
    }

    if (twoFactorPopupMode === 'verify-disable') {
      if (!pinValue || !/^\d{6}$/.test(pinValue)) {
        popup.error('Please enter your 6-digit security PIN.');
        return;
      }
      try {
        setIs2FASubmitting(true);
        await disable2FA(pinValue);
        setIsTwoFactorEnabled(false);
        popup.success('Two-step verification disabled successfully.');
        setShow2FAPopup(false);
      } catch (err) {
        popup.error(
          err instanceof Error ? err.message : 'Failed to disable 2FA. Please try again.'
        );
      } finally {
        setIs2FASubmitting(false);
      }
    }
  };

  // Handle ESC key to close confirmation dialog
  useEffect(() => {
    if (!showConfirmDialog) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmDialog(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showConfirmDialog]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderTabContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Business Logo</h3>
              <ProfileImageUpload
                currentImageUrl={profile.account.profileImage}
                onUploadSuccess={fetchProfile}
                disabled={isEditing}
                storeName={profile.business.storeName}
              />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.account?.fullName || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      account: { ...prev.account!, fullName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.account.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                  {profile.account.emailAddress}
                  <span className="ml-2 text-xs text-muted-foreground">(Cannot be changed)</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.account?.phoneNumber || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      account: { ...prev.account!, phoneNumber: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.account.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Created
                </label>
                <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        );

      case 'account-info':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
              {!isEditingAccountInfo && (
                <button
                  onClick={handleEditAccountInfo}
                  className="px-4 py-2 text-sm bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Name
                </label>
                <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                  {profile.accountInfo?.accountName || 'Nil'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Number
                </label>
                {isEditingAccountInfo ? (
                  <input
                    type="text"
                    value={accountInfoForm.accountNumber}
                    onChange={(e) =>
                      setAccountInfoForm((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.accountInfo?.accountNumber || 'Nil'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bank
                </label>
                {isEditingAccountInfo ? (
                  <div className="relative">
                    <input
                      ref={bankInputRef}
                      type="text"
                      value={accountInfoForm.bank}
                      onChange={(e) => handleBankInputChange(e.target.value)}
                      onFocus={() => {
                        if (accountInfoForm.bank.trim()) {
                          const suggestions = searchBanks(accountInfoForm.bank, allBanks.length ? allBanks : undefined);
                          setBankSuggestions(suggestions);
                          setShowBankSuggestions(suggestions.length > 0);
                        }
                      }}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Type to search bank name"
                    />
                    {showBankSuggestions && bankSuggestions.length > 0 && (
                      <div
                        ref={bankSuggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                      >
                        {bankSuggestions.map((bank) => (
                          <button
                            key={bank.code}
                            type="button"
                            onClick={() => handleBankSelect(bank)}
                            className="w-full text-left px-4 py-2 hover:bg-secondary focus:bg-secondary focus:outline-none text-foreground"
                          >
                            <div className="font-medium">{bank.name}</div>
                            <div className="text-xs text-muted-foreground">Code: {bank.code}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {accountInfoForm.settlementBank && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Selected: {accountInfoForm.settlementBankName} ({accountInfoForm.settlementBank})
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.accountInfo?.bank || 'Nil'}
                  </p>
                )}
              </div>

              {isEditingAccountInfo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showAccountInfoSecurityPin ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={6}
                      value={accountInfoForm.securityPin}
                      onChange={(e) =>
                        setAccountInfoForm((prev) => ({
                          ...prev,
                          securityPin: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Enter your 6-digit security PIN"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountInfoSecurityPin((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label={showAccountInfoSecurityPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showAccountInfoSecurityPin ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required to verify changes to your settlement account
                  </p>
                </div>
              )}
            </div>

            {isEditingAccountInfo && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelAccountInfo}
                    className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAccountInfo}
                    className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                >
                  Edit Business Info
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.business?.businessName || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      business: { ...prev.business!, businessName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.business.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.business?.storeName || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      business: { ...prev.business!, storeName: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.business.storeName}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Address
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.business?.businessAddress || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      business: { ...prev.business!, businessAddress: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.business.businessAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Business Registration Number
                </label>
                <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                  {profile.business.businessRegNumber || 'Nil'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tax ID Number
                </label>
                <p className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                  {profile.business.taxIdNumber || 'Nil'}
                </p>
              </div>
            </div>

            {/* Business Documents */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-foreground">Business Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 border border-border rounded-md">
                  <h5 className="font-medium text-foreground mb-2">ID Document</h5>
                  {profile.business.idDocument ? (
                    <button
                      onClick={() => setDocumentViewer({
                        url: profile.business.idDocument,
                        name: 'ID Document'
                      })}
                      className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                    >
                      📄 View Document
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not uploaded</p>
                  )}
                </div>
                <div className="p-4 border border-border rounded-md">
                  <h5 className="font-medium text-foreground mb-2">Business Registration Certificate</h5>
                  {profile.business.businessRegCertificate ? (
                    <button
                      onClick={() => setDocumentViewer({
                        url: profile.business.businessRegCertificate,
                        name: 'Business Registration Certificate'
                      })}
                      className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                    >
                      📄 View Certificate
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
            <div className="space-y-4">
              <div className="p-6 border border-border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {formatDate(profile.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenChangePassword}
                    className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-6 border border-border rounded-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">Account Security</h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          isTwoFactorEnabled
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Keep your account secure with strong authentication
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTwoFactorEnabled}
                    onClick={handle2FAToggleClick}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      isTwoFactorEnabled ? 'bg-[#8DEB6E]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                        isTwoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and business information</p>
        </div>
        <button
          onClick={fetchProfile}
          disabled={isLoading}
          className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {isLoading ? '🔄' : '↻'} Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false); // Reset editing state when switching tabs
                  setShowConfirmDialog(false); // Close dialog when switching tabs
                  // Account info tab is read-only, so ensure editing is disabled
                  if (tab.id === 'account-info') {
                    setIsEditing(false);
                  }
                }}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#8DEB6E] text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <span className="mr-2 lg:mr-3">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            {renderTabContent()}
            
            {/* Action Buttons - Only show when editing (and not on account-info tab which is read-only) */}
            {isEditing && activeTab !== 'account-info' && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (!isHoveringDialog && e.target === e.currentTarget) {
              handleCancelDialog();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onMouseEnter={() => setIsHoveringDialog(true)}
            onMouseLeave={() => setIsHoveringDialog(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Confirm Save
            </h2>
            <p className="text-foreground mb-6">
              Are you sure you want to save this information? You will be unable to edit it after this.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDialog}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {documentViewer && (
        <DocumentViewerModal
          documentUrl={documentViewer.url}
          documentName={documentViewer.name}
          onClose={() => setDocumentViewer(null)}
        />
      )}

      {/* Change Password Dialog */}
      {showChangePasswordDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseChangePassword();
            }
          }}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              Change Password
            </h2>
            <form className="space-y-4" onSubmit={handleSubmitChangePassword}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseChangePassword}
                  className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Popup - setup, enable, or disable */}
      {show2FAPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose2FAPopup();
          }}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-1">
              {twoFactorPopupMode === 'setup' && 'Set Up Security PIN'}
              {twoFactorPopupMode === 'verify-enable' && 'Enable Two-Step Verification'}
              {twoFactorPopupMode === 'verify-disable' && 'Disable Two-Step Verification'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit2FAPopup}>
              {twoFactorPopupMode === 'setup' && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Create a 6-digit PIN to protect sensitive account actions. You will need this to update your settlement details.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New 6-digit PIN</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        inputMode="numeric"
                        maxLength={6}
                        value={pinValue}
                        onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        placeholder="Enter 6-digit PIN"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm PIN</label>
                    <div className="relative">
                      <input
                        type={showConfirmPin ? 'text' : 'password'}
                        inputMode="numeric"
                        maxLength={6}
                        value={confirmPinValue}
                        onChange={(e) => setConfirmPinValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        placeholder="Re-enter 6-digit PIN"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showConfirmPin ? 'Hide PIN' : 'Show PIN'}
                      >
                        {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    Forgot your PIN? Use <span className="font-medium text-foreground">Forgot Password</span> on the login page, then set up a new PIN here.
                  </p>
                </>
              )}

              {(twoFactorPopupMode === 'verify-enable' || twoFactorPopupMode === 'verify-disable') && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {twoFactorPopupMode === 'verify-enable'
                      ? 'Enter your security PIN to enable two-step verification.'
                      : 'Enter your security PIN to disable two-step verification.'}
                  </p>
                  {twoFactorPopupMode === 'verify-enable' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPinValue('');
                        setConfirmPinValue('');
                        setTwoFactorPopupMode('setup');
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Don't have a PIN? Set one up
                    </button>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Security PIN</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        inputMode="numeric"
                        maxLength={6}
                        value={pinValue}
                        onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 pr-10 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        placeholder="Enter your 6-digit PIN"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose2FAPopup}
                  disabled={is2FASubmitting}
                  className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={is2FASubmitting}
                  className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50"
                >
                  {is2FASubmitting
                    ? 'Saving...'
                    : twoFactorPopupMode === 'setup'
                    ? 'Set PIN & Enable'
                    : twoFactorPopupMode === 'verify-enable'
                    ? 'Enable 2FA'
                    : 'Disable 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}