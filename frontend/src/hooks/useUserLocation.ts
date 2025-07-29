// hooks/useUserLocation.ts
import { useState, useEffect, useCallback } from 'react';

interface Coordinates {
    lat: number;
    lng: number;
}

interface LocationData {
    city: string;
    country: string;
    region?: string;
    coordinates?: Coordinates;
    source: 'geolocation' | 'ip';
    timestamp?: number;
}

interface UseUserLocationResult {
    location: LocationData | null;
    error: string | null;
    isLoading: boolean;
    refetch: () => void;
}

const CACHE_KEY = 'userLocation';
const CACHE_EXPIRY_DAYS = 7;

export const useUserLocation = (): UseUserLocationResult => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Проверка валидности кешированных данных
    const getValidCache = useCallback((): LocationData | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const parsed: LocationData = JSON.parse(cached);

            // Проверяем наличие обязательных полей и срок годности
            if (!parsed?.city || !parsed?.country) return null;

            if (parsed.timestamp) {
                const expiryDate = new Date(parsed.timestamp);
                expiryDate.setDate(expiryDate.getDate() + CACHE_EXPIRY_DAYS);
                if (new Date() > expiryDate) return null;
            }

            return parsed;
        } catch {
            return null;
        }
    }, []);

    // Сохранение в кеш
    const saveToCache = useCallback((data: LocationData) => {
        const cacheData = {
            ...data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }, []);

    // Основная функция получения локации
    const fetchLocation = useCallback(async (bypassCache = false): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Проверка кеша (если не bypass)
            if (!bypassCache) {
                const cached = getValidCache();
                if (cached) {
                    setLocation(cached);
                    setIsLoading(false);
                    return;
                }
            }

            // 2. Пробуем получить точные координаты
            const getCoordinates = (): Promise<Coordinates> => {
                return new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('Geolocation not supported'));
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        (position) => resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }),
                        (err) => reject(err),
                        { enableHighAccuracy: true, timeout: 10000 }
                    );
                });
            };

            try {
                const coords = await getCoordinates();

                // 3. Геокодирование через OpenStreetMap Nominatim
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
                );
                const data = await response.json();

                if (!data.address) {
                    throw new Error('No address data found');
                }

                const locationData: LocationData = {
                    city: data.address.city || data.address.town || data.address.village,
                    country: data.address.country,
                    region: data.address.state || data.address.region,
                    coordinates: coords,
                    source: 'geolocation'
                };

                setLocation(locationData);
                saveToCache(locationData);

            } catch (geoError) {
                console.warn('Geolocation failed, falling back to IP:', geoError);

                // 4. Fallback на IP-геолокацию
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipData = await ipResponse.json();

                if (ipData.error) {
                    throw new Error(ipData.reason || 'IP location failed');
                }

                const locationData: LocationData = {
                    city: ipData.city,
                    country: ipData.country_name,
                    region: ipData.region,
                    source: 'ip'
                };

                setLocation(locationData);
                saveToCache(locationData);
            }
        } catch (err) {
            console.error('Location detection error:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to determine location'
            );
        } finally {
            setIsLoading(false);
        }
    }, [getValidCache, saveToCache]);

    // Функция для ручного обновления
    const refetch = useCallback(() => {
        fetchLocation(true); // bypass cache
    }, [fetchLocation]);

    // Инициализация при монтировании
    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    return {
        location,
        error,
        isLoading,
        refetch
    };
};