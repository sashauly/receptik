import { useEffect, useMemo } from "react";

export function useObjectUrl(blob: Blob | undefined | null) {
  const url = useMemo(() => {
    if (!blob) return "";
    return URL.createObjectURL(blob);
  }, [blob]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}
