import React from "react";

interface AdminHeaderSkeletonProps {
  titleWidth?: string;
  subtitleWidth?: string;
}

export const AdminHeaderSkeleton: React.FC<AdminHeaderSkeletonProps> = ({
  titleWidth = "w-64",
  subtitleWidth = "w-96",
}) => (
  <header className="rounded-3xl border border-border bg-surface p-8 shadow-xl relative overflow-hidden animate-pulse">
    <div className={`h-9 ${titleWidth} rounded-xl bg-border mb-3`} />
    <div className={`h-4 ${subtitleWidth} rounded-xl bg-border`} />
  </header>
);

interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
}

export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  columns,
  rows = 5,
}) => (
  <div className="rounded-3xl border border-border bg-surface overflow-hidden shadow-inner animate-pulse">
    <div className="bg-background/50 px-6 py-4 flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 flex-1 rounded-lg bg-border/60" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-5 flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-6 flex-1 rounded-xl bg-border/40" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const AdminCardsSkeleton: React.FC = () => (
  <section className="flex gap-4 my-5 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="rounded-3xl border border-border bg-surface p-6 shadow-lg w-62.5 flex-1"
      >
        <div className="h-10 w-10 rounded-2xl bg-border mb-4" />
        <div className="h-4 w-32 rounded-xl bg-border mb-2" />
        <div className="h-7 w-16 rounded-xl bg-border" />
      </div>
    ))}
  </section>
);

export const AdminRegistrationSkeleton: React.FC = () => (
  <div className="bg-background p-5 space-y-5 animate-pulse">
    <AdminHeaderSkeleton titleWidth="w-72" subtitleWidth="w-80" />
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg space-y-6">
      <div className="flex gap-8 border-b border-border pb-2">
        <div className="h-8 w-32 rounded-xl bg-border" />
        <div className="h-8 w-32 rounded-xl bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="h-12 w-full rounded-2xl bg-border" />
          <div className="h-64 w-full rounded-3xl bg-border/40" />
        </div>
        <div className="col-span-1 rounded-3xl border border-border bg-surface/50 p-6 h-[80vh]">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-border" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded-lg bg-border" />
              <div className="h-3 w-24 rounded-lg bg-border" />
            </div>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <div className="space-y-4">
            <div className="h-4 w-40 rounded-lg bg-border" />
            <div className="h-40 w-full rounded-2xl bg-border" />
            <div className="h-40 w-full rounded-2xl bg-border" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
