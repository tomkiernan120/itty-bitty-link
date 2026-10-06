import { useId } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps {
    label?: string;
    type?: 'text' | 'password' | 'email' | 'url';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    name?: string;
    error?: string;
}

export default function Input({ label, type, placeholder, value, onChange, required, disabled, wrapperClassName, labelClassName, inputClassName, name, defaultValue, error }: InputProps) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div className={twMerge("flex flex-col flex-grow flex-shrink-0 space-y-2", wrapperClassName)}>
            {label && <label htmlFor={id} className={twMerge("text-base text-slate-700 font-medium w-full",labelClassName)}>{label}</label>}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                name={name ?? label}
                defaultValue={defaultValue}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={twMerge("h-12 rounded-lg border border-gray-200 bg-slate-100 px-3 w-full text-base focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-200 transition-all", error && "border-red-300", inputClassName )}
            />
            {error && <p id={errorId} className="text-sm text-red-700">{error}</p>}
        </div>
    )
}
