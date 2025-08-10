// @/pages/analytics/charts/TopViewedProducts.tsx
import React from 'react';
import SimpleLineChart from '@/pages/analytics/charts/SimpleLineChart.tsx';
import {useTranslation} from "react-i18next";

interface TopViewedProductsProps {
    data: any[];
}

const TopViewedProducts: React.FC<TopViewedProductsProps> = ({ data }) => {
    const { t } = useTranslation()

    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics.all.views")}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    return (
        <SimpleLineChart
            description={t("analytics.views")}
            data={data}
            title={t("analytics.all.views")}
        />
    );
};

export default TopViewedProducts;