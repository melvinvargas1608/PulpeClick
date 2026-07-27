interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export default function Switch({ checked, onChange, disabled, label, id }: SwitchProps) {
  const switchId = id || crypto.randomUUID();

  return (
    <label
      htmlFor={switchId}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`
          relative inline-flex h-5 w-9 shrink-0 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${checked ? 'bg-brand' : 'bg-gray-300'}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'}
          `}
        />
      </button>
      {label && (
        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
}
