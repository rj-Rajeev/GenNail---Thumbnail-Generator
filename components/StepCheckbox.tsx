"use client";
import React from "react";

interface StepCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  title: string;
  desc?: string;
}

export default function StepCheckbox({
  checked,
  onToggle,
  title,
  desc,
}: StepCheckboxProps) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
        ${
          checked
            ? "border-blue-500 bg-blue-50 shadow-sm"
            : "border-dashed border-gray-300 hover:border-blue-300 hover:bg-gray-50"
        }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-5 w-5 rounded border-gray-400 text-blue-500 focus:ring-2 focus:ring-blue-400"
        aria-checked={checked}
        aria-label={title}
      />

      {/* Text */}
      <div>
        <div
          className={`font-medium ${
            checked ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {title}
        </div>
        {desc && (
          <div className="step-desc text-sm text-gray-600 leading-snug">
            {desc}
          </div>
        )}
      </div>
    </label>
  );
}
