import React from "react";

interface HeaderProps {
  title:string;
  description:string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {


  return (
    <header className="rounded-3xl border border-border bg-surface p-6 shadow-lg mb-6">
        <p className="text-xl font-bold text-primary uppercase tracking-[0.4em] ">
           {title}
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-sm text-text-secondary">
            {description}
            </p>
        </div>
        </div>

    </header>
    );
};