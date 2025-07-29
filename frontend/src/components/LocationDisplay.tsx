import React from 'react';
import {useUserLocation} from '@/hooks/useUserLocation';
import {Spinner} from './ui/Spinner';
// import { IconMapPin, IconRefresh } from './ui/Icons';

export const LocationDisplay = () => {
    const {location, error, isLoading, refetch} = useUserLocation();

    return (
        <div className="flex items-center space-x-2">
            {/*<IconMapPin className="h-5 w-5 text-gray-500" />*/}

            {isLoading ? (
                <div className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4"/>
                    <span className="text-sm text-gray-600">Определяем местоположение...</span>
                </div>
            ) : error ? (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={refetch}
                        className="text-blue-500 hover:text-blue-700"
                        title="Повторить попытку"
                    >
                        {/*<IconRefresh className="h-4 w-4" />*/}
                    </button>
                </div>
            ) : location ? (
                <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-800">
            {location.city}, {location.country}
              {location.region && `, ${location.region}`}
          </span>
                    <span className="text-xs text-gray-400">
          </span>
                    <button
                        onClick={refetch}
                        className="text-gray-400 hover:text-gray-600"
                        title="Обновить местоположение"
                    >
                        {/*<IconRefresh className="h-3 w-3" />*/}
                    </button>
                </div>
            ) : null}
        </div>
    );
};