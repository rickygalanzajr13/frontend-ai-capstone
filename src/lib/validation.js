const NAME_LETTERS_ONLY_REGEX = /^[a-zA-Z\s]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;

export function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  if (!NAME_LETTERS_ONLY_REGEX.test(trimmed)) {
    return 'Name must contain letters only.';
  }
  return '';
}

export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
  return '';
}

export function isChangingPassword(newPassword, confirmPassword) {
  return newPassword.length > 0 || confirmPassword.length > 0;
}

export function validateCurrentPassword(currentPassword, newPassword, confirmPassword) {
  if (isChangingPassword(newPassword, confirmPassword) && !currentPassword) {
    return 'Current password is required when changing your password.';
  }
  return '';
}

export function validateNewPassword(newPassword, confirmPassword) {
  if (!isChangingPassword(newPassword, confirmPassword)) return '';
  if (newPassword.length < 8) return 'New password must be at least 8 characters.';
  return '';
}

export function validateConfirmPassword(newPassword, confirmPassword) {
  if (!isChangingPassword(newPassword, confirmPassword)) return '';
  if (confirmPassword !== newPassword) return 'Passwords do not match.';
  return '';
}

export function validateForm(values) {
  const errors = {
    fullName: validateName(values.fullName),
    email: validateEmail(values.email),
    currentPassword: validateCurrentPassword(
      values.currentPassword,
      values.newPassword,
      values.confirmPassword,
    ),
    newPassword: validateNewPassword(values.newPassword, values.confirmPassword),
    confirmPassword: validateConfirmPassword(values.newPassword, values.confirmPassword),
  };

  const isValid = Object.values(errors).every((error) => !error);
  return { errors, isValid };
}
