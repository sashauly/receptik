import { useEffect, useState } from "react";

export function useObjectUrl(blob: Blob | undefined | null) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    if (!blob) {
      setUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);
  return url;
}
