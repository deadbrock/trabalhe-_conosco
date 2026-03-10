"use client";

import * as React from "react";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value = "", onValueChange, onChange, children, className = "" }: SelectProps) {
  // Modo nativo: quando onChange é passado, renderiza como <select> nativo
  if (onChange !== undefined) {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
      >
        {children}
      </select>
    );
  }

  // Modo composto: quando onValueChange é passado
  return (
    <SelectCompound value={value} onValueChange={onValueChange} className={className}>
      {children}
    </SelectCompound>
  );
}

function SelectCompound({ value = "", onValueChange, children, className = "" }: {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, open, setOpen }}>
      <div className={`relative ${className}`}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select (compound mode)");
  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
    >
      {children}
      <svg className="h-4 w-4 opacity-50 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select (compound mode)");
  return <span className="truncate">{context.value || placeholder}</span>;
}

export function SelectContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select (compound mode)");
  if (!context.open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => context.setOpen(false)} />
      <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg ${className}`}>
        {children}
      </div>
    </>
  );
}

export function SelectItem({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select (compound mode)");
  return (
    <div
      onClick={() => context.onValueChange(value)}
      className={`relative flex cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-gray-100 ${context.value === value ? "bg-blue-50 text-blue-600 font-medium" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
