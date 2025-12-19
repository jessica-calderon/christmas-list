import { useState, useEffect, useMemo } from 'react';
import { subscribeToSantaTracking, subscribeToRecipientStatus, updateRecipientStatus, getSantaUserId } from '../services/santaTracking';
import type { SantaGiftTracking, SantaRecipientStatusData } from '../types/santaTracking';
import { isSanta } from '../config/santa';

/**
 * Hook to manage Santa tracking data for all recipients
 * Only loads data when Santa Mode is active
 */
export function useSantaTracking() {
  const [tracking, setTracking] = useState<SantaGiftTracking>({});
  const [isLoading, setIsLoading] = useState(true);
  const santaMode = isSanta();

  useEffect(() => {
    if (!santaMode) {
      setTracking({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const santaUserId = getSantaUserId();
    const unsubscribe = subscribeToSantaTracking(santaUserId, (data) => {
      setTracking(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [santaMode]);

  const getRecipientStatus = useMemo(
    () => (recipientId: string): SantaRecipientStatusData | null => {
      return tracking[recipientId] || null;
    },
    [tracking]
  );

  const updateStatus = async (
    recipientId: string,
    status: SantaRecipientStatusData['status'],
    notes?: string
  ) => {
    if (!santaMode) return;
    const santaUserId = getSantaUserId();
    await updateRecipientStatus(santaUserId, recipientId, status, notes);
  };

  return {
    tracking,
    isLoading,
    getRecipientStatus,
    updateStatus,
    isSantaMode: santaMode,
  };
}

/**
 * Hook to manage status for a specific recipient
 * Only loads data when Santa Mode is active
 */
export function useRecipientStatus(recipientId: string) {
  const [status, setStatus] = useState<SantaRecipientStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const santaMode = isSanta();

  useEffect(() => {
    if (!santaMode || !recipientId) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const santaUserId = getSantaUserId();
    const unsubscribe = subscribeToRecipientStatus(santaUserId, recipientId, (data) => {
      setStatus(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [santaMode, recipientId]);

  const updateStatus = async (
    newStatus: SantaRecipientStatusData['status'],
    notes?: string
  ) => {
    if (!santaMode) return;
    const santaUserId = getSantaUserId();
    await updateRecipientStatus(santaUserId, recipientId, newStatus, notes);
  };

  return {
    status,
    isLoading,
    updateStatus,
    isSantaMode: santaMode,
  };
}

