// @/pages/analytics/charts/TopFavoriteCosmetics.tsx
import React from 'react';
import SimpleBarChart from '@/pages/analytics/charts/SimpleBarChart.tsx';
import {useTranslation} from "react-i18next";

// TopFavoriteCosmetics.tsx
export interface FavoriteCosmetic {
    id: number;
    name: string;
    favoriteCount: number;
}

interface TopFavoriteCosmeticsProps {
    data: FavoriteCosmetic[];
    startDate?: string;
    endDate?: string;
}
const TopFavoriteCosmetics: React.FC<TopFavoriteCosmeticsProps> = ({ data }) => {
    const { t } = useTranslation();

    const chartData = data.map(item => ({
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