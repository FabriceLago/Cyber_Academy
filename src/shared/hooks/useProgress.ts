import { useEffect, useState } from 'react';
import { StorageService } from '../../core/services/storageService';
import { UserProgress } from '../../core/types/cyber.types';

export function useProgress(): UserProgress {
  const [progress, setProgress] = useState<UserProgress>(StorageService.getProgress());

  useEffect(() => {
    const unsubscribe = StorageService.subscribe((updated) => {
      setProgress(updated);
    });
    return unsubscribe;
  }, []);

  return progress;
}
