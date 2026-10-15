'use client';

import { useEffect, useState } from 'react';

/**
 * Returns false on the server and during initial client hydration pass.
 * Sets to true immediately after mount, preventing SSR hydration mismatches.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
