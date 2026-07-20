import { useState } from 'react';
import './ProfileSettingsForm.css';

const INITIAL_PROFILE = {
  fullName: 'Alex Rivera',
  username: 'alexrivera',
  email: 'alex.rivera@example.com',
  phone: '',
  location: '',
  bio: '',
  website: '',
  timezone: 'America/New_York',
  emailNotifications: true,
  marketingEmails: false,
};

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Manila', label: 'Manila (PHT)' },
  { value: 'UTC', label: 'UTC' },
];

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(values.username)) {
    errors.username = 'Use 3–20 letters, numbers, or underscores.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.website && !/^https?:\/\/.+\..+/.test(values.website)) {
    errors.website = 'Enter a valid URL starting with http:// or https://';
  }

  if (values.bio.length > 280) {
    errors.bio = 'Bio must be 280 characters or fewer.';
  }

  return errors;
}

function ProfileSettingsForm() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (status) {
      setStatus(null);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: 'error', message: 'Please fix the errors below.' });
      return;
    }

    setSavedProfile(profile);
    setErrors({});
    setStatus({ type: 'success', message: 'Profile updated successfully.' });
  }

  function handleReset() {
    setProfile(savedProfile);
    setErrors({});
    setStatus(null);
  }

  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <section className="profile-settings" aria-labelledby="profile-settings-title">
      <header className="profile-settings__header">
        <div className="profile-settings__avatar" aria-hidden="true">
          {initials || '?'}
        </div>
        <div>
          <h1 id="profile-settings-title">Profile Settings</h1>
          <p className="profile-settings__subtitle">
            Update your personal information and preferences.
          </p>
        </div>
      </header>

      {status && (
        <div
          className={`profile-settings__status profile-settings__status--${status.type}`}
          role="status"
        >
          {status.message}
        </div>
      )}

      <form className="profile-settings__form" onSubmit={handleSubmit} noValidate>
        <fieldset className="profile-settings__section">
          <legend>Personal information</legend>

          <div className="profile-settings__field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={profile.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <span id="fullName-error" className="profile-settings__error" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="profile-settings__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={profile.username}
              onChange={handleChange}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (
              <span id="username-error" className="profile-settings__error" role="alert">
                {errors.username}
              </span>
            )}
          </div>

          <div className="profile-settings__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={profile.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="profile-settings__error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="profile-settings__row">
            <div className="profile-settings__field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Optional"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="profile-settings__field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                autoComplete="address-level2"
                placeholder="City, Country"
                value={profile.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-settings__field">
            <label htmlFor="bio">
              Bio
              <span className="profile-settings__hint">
                {profile.bio.length}/280
              </span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Tell others a little about yourself"
              value={profile.bio}
              onChange={handleChange}
              aria-invalid={Boolean(errors.bio)}
              aria-describedby={errors.bio ? 'bio-error' : undefined}
            />
            {errors.bio && (
              <span id="bio-error" className="profile-settings__error" role="alert">
                {errors.bio}
              </span>
            )}
          </div>

          <div className="profile-settings__field">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="url"
              autoComplete="url"
              placeholder="https://example.com"
              value={profile.website}
              onChange={handleChange}
              aria-invalid={Boolean(errors.website)}
              aria-describedby={errors.website ? 'website-error' : undefined}
            />
            {errors.website && (
              <span id="website-error" className="profile-settings__error" role="alert">
                {errors.website}
              </span>
            )}
          </div>
        </fieldset>

        <fieldset className="profile-settings__section">
          <legend>Preferences</legend>

          <div className="profile-settings__field">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={profile.timezone}
              onChange={handleChange}
            >
              {TIMEZONES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="profile-settings__checkbox-group">
            <label className="profile-settings__checkbox">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={profile.emailNotifications}
                onChange={handleChange}
              />
              <span>
                <strong>Email notifications</strong>
                <small>Receive updates about account activity.</small>
              </span>
            </label>

            <label className="profile-settings__checkbox">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={profile.marketingEmails}
                onChange={handleChange}
              />
              <span>
                <strong>Marketing emails</strong>
                <small>Get product news and feature announcements.</small>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="profile-settings__actions">
          <button
            type="button"
            className="profile-settings__button profile-settings__button--secondary"
            onClick={handleReset}
            disabled={!isDirty}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-settings__button profile-settings__button--primary"
            disabled={!isDirty}
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfileSettingsForm;
