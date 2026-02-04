import { useEffect, useRef, useState, useCallback } from 'react';
import { productsApi } from './useApi';

export interface ScanStatus {
  status: 'idle' | 'scanning' | 'completed';
  scan_id?: string;
  total_sources?: number;
  completed_sources?: number;
  failed_sources?: number;
  leads_found?: number;
  current_source?: string;
  current_stage?: string;
  detail?: string;
  errors?: string[];
  started_at?: string;
}

interface UseScanProgressOptions {
  productId: number;
  enabled: boolean;
  onNewLeadsFound?: () => void;
}

export function useScanProgress({ productId, enabled, onNewLeadsFound }: UseScanProgressOptions) {
  const [scanStatus, setScanStatus] = useState<ScanStatus>({ status: 'idle' });
  const previousLeadsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onNewLeadsFoundRef = useRef(onNewLeadsFound);
  onNewLeadsFoundRef.current = onNewLeadsFound;

  const poll = useCallback(async () => {
    try {
      const data: ScanStatus = await productsApi.scanStatus(productId);
      setScanStatus(data);

      if (data.leads_found && data.leads_found > previousLeadsRef.current) {
        previousLeadsRef.current = data.leads_found;
        onNewLeadsFoundRef.current?.();
      }

      return data.status;
    } catch {
      return 'idle';
    }
  }, [productId]);

  useEffect(() => {
    if (!enabled || !productId) {
      return;
    }

    // Initial poll immediately
    poll();

    intervalRef.current = setInterval(async () => {
      const status = await poll();
      if (status === 'idle' || status === 'completed') {
        // Do one final refresh then stop
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, productId, poll]);

  const startPolling = useCallback(() => {
    previousLeadsRef.current = 0;
    setScanStatus({ status: 'scanning' });
  }, []);

  const stopScan = useCallback(async () => {
    try {
      await productsApi.stopScan(productId);
      setScanStatus((prev) => ({ ...prev, status: 'completed', detail: 'Scan stopped by user' }));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      console.error('Failed to stop scan:', err);
    }
  }, [productId]);

  const isScanning = scanStatus.status === 'scanning';

  return { scanStatus, isScanning, startPolling, stopScan };
}
