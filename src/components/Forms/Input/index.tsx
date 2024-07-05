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
}

export default function Input({ label, type, placeholder, value, onChange, required, disabled, wrapperClassName, labelClassName, inputClassName, name, defaultValue }: InputProps) {
    return (
        <div className={twMerge("flex flex-col flex-grow flex-shrink-0 space-y-2", wrapperClassName)}>
            {label && <label className={twMerge("text-base text-gray-800 w-full",labelClassName)}>{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                name={name ?? label}
                defaultValue={defaultValue}
                className={twMerge("h-12 rounded-lg border border-gray-200 bg-slate-100 px-2 w-full text-base", inputClassName )}
            />
        </div>
    )
}