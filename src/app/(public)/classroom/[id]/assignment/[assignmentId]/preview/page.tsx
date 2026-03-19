"use client";

export default function PreviewPage() {
  const previewUrl = "https://th.wikipedia.org/wiki/"; 

  return (
    <div className="w-full h-full">
      <iframe
        src={previewUrl}
        title="project preview"
        className="w-full h-full"
      />
    </div>
  );
}