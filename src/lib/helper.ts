

export const validatePasswords = (newPassword: string, confirmPassword: string) => {
  if (!newPassword || newPassword.length < 8 || newPassword.length > 64) {
    return 'Password must be between 8-64 characters.';
  }
  
  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || 
      !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    return 'Password must include an uppercase letter, a lowercase letter, a number, and a special character.';
  }
  
  if (newPassword !== confirmPassword) {
    return 'Passwords do not match.';
  }
  
  return '';
};