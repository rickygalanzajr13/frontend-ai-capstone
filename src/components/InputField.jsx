import './InputField.css';

export default function InputField({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  disabled = false,
}) {
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className="input-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="input-field__required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
      />
      {error && (
        <p id={errorId} className="input-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
