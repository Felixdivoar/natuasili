import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
  };
};

// Hook for managing offline bookings
export const useOfflineBookings = () => {
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);

  useEffect(() => {
    // Load pending bookings from localStorage
    const saved = localStorage.getItem('natuasili_pending_bookings');
    if (saved) {
      try {
        setPendingBookings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading pending bookings:', error);
      }
    }
  }, []);

  const addPendingBooking = (booking: any) => {
    const newBooking = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: booking,
    };

    const updated = [...pendingBookings, newBooking];
    setPendingBookings(updated);
    localStorage.setItem('natuasili_pending_bookings', JSON.stringify(updated));

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return (registration as any).sync.register('background-sync-bookings');
      });
    }
  };

  const removePendingBooking = (id: string) => {
    const updated = pendingBookings.filter(booking => booking.id !== id);
    setPendingBookings(updated);
    localStorage.setItem('natuasili_pending_bookings', JSON.stringify(updated));
  };

  const clearPendingBookings = () => {
    setPendingBookings([]);
    localStorage.removeItem('natuasili_pending_bookings');
  };

  return {
    pendingBookings,
    addPendingBooking,
    removePendingBooking,
    clearPendingBookings,
  };
};

// Hook for push notifications
export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const subscribe = async (): Promise<PushSubscription | null> => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: undefined, // Replace with your VAPID key when implementing push notifications
        });

        setSubscription(sub);
        
        // Send subscription to your server
        // await fetch('/api/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(sub),
        // });

        return sub;
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        return null;
      }
    }

    return null;
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        return true;
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        return false;
      }
    }
    return false;
  };

  return {
    permission,
    subscription,
    isSupported: 'Notification' in window && 'serviceWorker' in navigator,
    requestPermission,
    subscribe,
    unsubscribe,
  };
};