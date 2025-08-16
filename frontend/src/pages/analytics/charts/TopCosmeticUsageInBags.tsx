// @/pages/analytics/charts/TopFavoriteCosmetics.tsx
import React from 'react';
import SimpleBarChart from '@/pages/analytics/charts/SimpleBarChart.tsx';
import {useTranslation} from "react-i18next";

// TopFavoriteCosmetics.tsx
export interface CosmeticUsageInBugs {
    name: string;
    count: number;
}

interface TopCosmeticUsageInBagsProps {
    data: CosmeticUsageInBugs[];
    startDate?: string;
    endDate?: string;
}
const TopCosmeticUsageInBags: React.FC<TopCosmeticUsageInBagsProps> = ({ data }) => {
    const { t } = useTranslation();

    const chartData = data.map(item => ({
        label: item.name,
        count: item.count,
        info: t("analytics.count")
    }));

    return (
        <SimpleBarChart
            data={chartData}
            title={t("analytics.top.cosmeticInBag")}
        />
    );
};

export default TopCosmeticUsageInBags;