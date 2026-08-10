import { useRef, useEffect, useCallback, useState } from "react";
import { findVerticalScrollContainer } from "../table-utils";

export interface UseTableGrowingOptions {
  mode: string;
  enabled: boolean;
  onLoadMore?: () => void;
}

export function useTableGrowing(options: UseTableGrowingOptions) {
  const { mode, enabled, onLoadMore } = options;
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !onLoadMore) return;
    setIsLoading(true);
    try {
      await Promise.resolve(onLoadMore());
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onLoadMore]);

  // Scroll mode: IntersectionObserver
  useEffect(() => {
    if (!enabled || mode !== "Scroll" || !triggerRef.current) return;

    const scrollContainer = findVerticalScrollContainer(triggerRef.current);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "0px 0px 100px 0px",
      },
    );

    observer.observe(triggerRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [enabled, mode, handleLoadMore]);

  return {
    isLoading,
    triggerRef,
    handleLoadMore,
  };
}
