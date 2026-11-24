// src/components/docs/DocLoading.tsx
export default function DocLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-48 w-48 border-b-2 border-r-2 border-transparent border-b-paper border-r-paper"></div>
    </div>
  );
}
