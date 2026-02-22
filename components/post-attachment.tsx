export default function PostAttachment({
  fileUrl,
  fileType,
}: {
  fileUrl: string;
  fileType: string | null;
}) {
  if (fileType?.startsWith("image/")) {
    return (
      <div className="mt-3 px-4">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl}
            alt="Attached image"
            className="max-h-96 w-auto rounded-lg border border-warm-200 object-contain"
          />
        </a>
      </div>
    );
  }

  if (fileType === "application/pdf") {
    const filename = fileUrl.split("/").pop() || "document.pdf";
    return (
      <div className="mt-3 px-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-warm-500">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
          {filename}
        </a>
      </div>
    );
  }

  return null;
}
