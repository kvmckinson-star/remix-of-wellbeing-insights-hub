import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'select' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
  readOnly?: boolean;
  hint?: string;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  step?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label, id, type = 'text', value, onChange, options, placeholder,
  readOnly = false, hint, fullWidth = false, min, max, step
}) => {
  const baseClass = 'w-full px-3 py-2 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors';
  const readOnlyClass = readOnly ? 'bg-muted cursor-not-allowed' : '';

  return (
    <div className={fullWidth ? 'col-span-1 md:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${baseClass} ${readOnlyClass}`}
          disabled={readOnly}
        >
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${baseClass} ${readOnlyClass}`}
          placeholder={placeholder}
          rows={3}
          readOnly={readOnly}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${baseClass} ${readOnlyClass}`}
          placeholder={placeholder}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
        />
      )}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => (
  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
    />
    <span className="text-foreground">{label}</span>
  </label>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-card rounded-xl border border-border p-6 shadow-sm mb-6 ${className}`}>
    <h3 className="text-lg font-semibold text-primary mb-4 pb-2 border-b-2 border-secondary">
      {title}
    </h3>
    {children}
  </div>
);
