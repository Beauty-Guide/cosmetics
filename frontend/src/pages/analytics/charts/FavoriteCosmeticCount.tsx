// @/pages/analytics/TopFavoriteCosmetics.tsx
import React, { useEffect, useState } from 'react';
import SimpleBarChart from '@/pages/analytics/charts/SimpleBarChart.tsx';
import {getTopFavoriteCosmetics} from "@/services/analyticsApi.ts"; // 引入 SimpleBarChart

interface FavoriteCosmeticCount {
    id: number;
    name: string;
    favoriteCount: number;
}

const TopFavoriteCosmetics = () => {
    const [favoriteCosmetics, setFavoriteCosmetics] = useState<FavoriteCosmeticCount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopFavorites = async () => {
            try {
                const data = await getTopFavoriteCosmetics();
                setFavoriteCosmetics(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopFavorites();
    }, []);

    if (loading) return <div>Loading...</div>;

    const chartData = favoriteCosmetics.map(item => ({
        label: item.name,
        count: item.favoriteCount,
    }));

    return (<SimpleBarChart description={"Просмотров"} data={chartData} title={"Топ избранных товаров"} />);
};

export default TopFavoriteCosmetics;