

export const validatePasswords = (newPassword:string, confirmPassword:string) => {
  if (!newPassword || newPassword.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  
  if (newPassword.length > 64) {
    return 'Password must be less than 64 characters.';
  }
  
  if (!/[A-Z]/.test(newPassword)) {
    return 'Password must contain at least one uppercase letter.';
  }
  
  if (!/[a-z]/.test(newPassword)) {
    return 'Password must contain at least one lowercase letter.';
  }
  
  if (!/[0-9]/.test(newPassword)) {
    return 'Password must contain at least one number.';
  }
  
  if (!/[!@#$%^&*]/.test(newPassword)) {
    return 'Password must contain at least one special character.';
  }
  
  if (newPassword !== confirmPassword) {
    return 'Passwords do not match.';
  }
  
  return ''; // No error, validation passed
};