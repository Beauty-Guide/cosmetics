// @/pages/analytics/TopFavoriteCosmetics.tsx
import React, { useEffect, useState } from 'react';
import SimpleBarChart from '@/pages/analytics/charts/SimpleBarChart.tsx';
import {getTopFavoriteCosmetics} from "@/services/analyticsApi.ts";
import {useTranslation} from "react-i18next";

interface FavoriteCosmeticCount {
    id: number;
    name: string;
    favoriteCount: number;
}

const TopFavoriteCosmetics = () => {
    const [favoriteCosmetics, setFavoriteCosmetics] = useState<FavoriteCosmeticCount[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation()


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

    if (loading) return <div className="p-4 text-center">Загрузка...</div>;

    const chartData = favoriteCosmetics.map(item => ({
        label: item.name,
        count: item.favoriteCount,
    }));

    return (
        <SimpleBarChart
            description={t("analytics.favorite")}
            data={chartData}
            title={t("analytics.top.favorite")}
        />
    );
};

export default TopFavoriteCosmetics;