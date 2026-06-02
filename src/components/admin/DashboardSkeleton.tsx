export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <MetricsSkeleton />
      <HealthActivitySkeleton />
      <ChartsSkeleton />
      <ProjectsSkeleton />
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-32 bg-slate-200" />
              <div className="h-8 w-24 bg-slate-200" />
              <div className="h-4 w-40 bg-slate-100" />
            </div>
            <div className="h-9 w-9 bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HealthActivitySkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px] animate-pulse">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="h-4 w-28 bg-slate-200" />
            <div className="mt-2 h-3 w-64 bg-slate-100" />
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <div className="col-span-2 h-5 bg-slate-100" />
                <div className="h-5 bg-slate-100" />
                <div className="h-5 bg-slate-100" />
                <div className="h-5 bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="h-4 w-32 bg-slate-200" />
            <div className="mt-2 h-3 w-44 bg-slate-100" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="h-4 w-36 bg-slate-100" />
                <div className="h-5 w-8 bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border border-slate-200 bg-white shadow-sm min-h-[420px]">
        <div className="border-b border-slate-100 bg-slate-50 p-4">
          <div className="h-4 w-28 bg-slate-200" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-slate-100" />
                <div className="h-3 w-1/3 bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px] animate-pulse">
      <div className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 h-10 w-56 bg-slate-100" />
        <div className="h-72 bg-slate-100" />
      </div>
      <div className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 h-10 w-56 bg-slate-100" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="mb-2 flex justify-between">
                <div className="h-3 w-20 bg-slate-100" />
                <div className="h-3 w-16 bg-slate-100" />
              </div>
              <div className="h-2 bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-5 h-10 w-64 bg-slate-100" />
        <div className="h-56 bg-slate-100" />
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-4 animate-pulse">
      <div>
        <div className="h-3 w-32 bg-slate-200" />
        <div className="mt-3 h-6 w-44 bg-slate-100" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="h-3 w-24 bg-slate-200" />
            <div className="mt-3 h-7 w-14 bg-slate-200" />
            <div className="mt-2 h-3 w-28 bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
