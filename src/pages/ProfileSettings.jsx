import ProfileSettingsForm from '../components/ProfileSettingsForm';
import './ProfileSettings.css';

export default function ProfileSettings() {
  return (
    <main className="profile-settings">
      <header className="profile-settings__header">
        <div className="profile-settings__avatar" aria-hidden="true">
          PS
        </div>
        <div>
          <h1>Profile Settings</h1>
          <p className="profile-settings__subtitle">
            Update your account information and password.
          </p>
        </div>
      </header>

      <ProfileSettingsForm />
    </main>
  );
}
