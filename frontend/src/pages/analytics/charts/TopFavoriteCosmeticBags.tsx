// @/pages/analytics/charts/TopFavoriteCosmeticBags.tsx
import React from 'react';
import SimpleBarChart from '@/pages/analytics/charts/SimpleBarChart.tsx';
import {useTranslation} from "react-i18next";


export interface FavoriteCosmeticBag {
    id: number;
    name: string;
    author: string;
    favoriteCount: number;
}

interface TopFavoriteCosmeticBagsProps {
    data: FavoriteCosmeticBag[];
    startDate?: string;
    endDate?: string;
}
const TopFavoriteCosmeticBags: React.FC<TopFavoriteCosmeticBagsProps> = ({ data }) => {
    const { t } = useTranslation();


    const chartData = data.map(item => ({
        label: item.name,
        count: item.favoriteCount,
        author: item.author,
        info: t("analytics.favorite")
    }));

    return (
        <SimpleBarChart
            data={chartData}
            title={t("analytics.top.favoriteBag")}
        />
    );
};

export default TopFavoriteCosmeticBags;