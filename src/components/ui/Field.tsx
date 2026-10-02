import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/format';
import s from './Field.module.css';

interface BaseProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
}

function Wrapper({ label, error, hint, required, className, fid, children }: BaseProps & { fid: string; children: ReactNode }) {
  return (
    <div className={cx(s.field, error && s.invalid, className)}>
      <label htmlFor={fid}>
        {label}
        {required && (
          <span className={s.req} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {(error || hint) && (
        <p id={`${fid}-desc`} className={error ? s.error : s.hint}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

const aria = (fid: string, error?: string, hint?: ReactNode, required?: boolean) => ({
  'aria-invalid': error ? true : undefined,
  'aria-required': required || undefined,
  'aria-describedby': error || hint ? `${fid}-desc` : undefined,
});

export function Field({ label, error, hint, required, className, id, ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const uid = useId();
  const fid = id ?? uid;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} className={className} fid={fid}>
      <input id={fid} {...aria(fid, error, hint, required)} {...rest} />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  className,
  id,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const uid = useId();
  const fid = id ?? uid;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} className={className} fid={fid}>
      <select id={fid} {...aria(fid, error, hint, required)} {...rest}>
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({ label, error, hint, required, className, id, ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const uid = useId();
  const fid = id ?? uid;
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} className={className} fid={fid}>
      <textarea id={fid} {...aria(fid, error, hint, required)} {...rest} />
    </Wrapper>
  );
}
