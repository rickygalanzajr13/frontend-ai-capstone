import { useMemo, useState } from 'react';
import InputField from './InputField';
import { validateForm } from '../lib/validation';
import './ProfileSettingsForm.css';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const INITIAL_TOUCHED = {
  fullName: false,
  email: false,
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

function mockSaveProfile() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1200);
  });
}

export default function ProfileSettingsForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { errors, isValid } = useMemo(() => validateForm(values), [values]);

  const showError = (field) => (touched[field] || submitAttempted ? errors[field] : '');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSuccessMessage('');
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSuccessMessage('');

    const result = validateForm(values);
    if (!result.isValid) return;

    setIsSubmitting(true);
    try {
      await mockSaveProfile();
      setSuccessMessage('Profile updated successfully.');
      setTouched(INITIAL_TOUCHED);
      setSubmitAttempted(false);
      setValues((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="profile-settings-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
    >
      {successMessage && (
        <div className="profile-settings-form__status profile-settings-form__status--success" role="status">
          {successMessage}
        </div>
      )}

      <fieldset className="profile-settings-form__section" disabled={isSubmitting}>
        <legend className="profile-settings-form__legend">Account Information</legend>

        <InputField
          id="fullName"
          name="fullName"
          label="Full Name"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('fullName')}
          required
          autoComplete="name"
        />

        <InputField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('email')}
          required
          autoComplete="email"
        />
      </fieldset>

      <fieldset className="profile-settings-form__section" disabled={isSubmitting}>
        <legend className="profile-settings-form__legend">Change Password</legend>

        <InputField
          id="currentPassword"
          name="currentPassword"
          label="Current Password"
          type="password"
          value={values.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showError('currentPassword')}
          autoComplete="current-password"
        />

        <div className="profile-settings-form__row">
          <InputField
            id="newPassword"
            name="newPassword"
            label="New Password"
            type="password"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('newPassword')}
            autoComplete="new-password"
          />

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('confirmPassword')}
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      <div className="profile-settings-form__actions">
        <button
          type="submit"
          className="profile-settings-form__button profile-settings-form__button--primary"
          disabled={!isValid || isSubmitting}
          aria-disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
