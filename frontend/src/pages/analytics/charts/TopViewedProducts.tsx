// @/pages/analytics/charts/TopViewedProducts.tsx
import React from 'react';
import SimpleLineChart from '@/pages/analytics/charts/SimpleLineChart.tsx';

interface TopViewedProductsProps {
    data: any[];
}

const TopViewedProducts: React.FC<TopViewedProductsProps> = ({ data }) => {
    if (data.length === 0) {
        return (<div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <p>Нет данных для отображения</p>
        </div>);
    }
    return (<SimpleLineChart description={"Просмотров"} data={data} title={"Количество просмотров в день"} />);
};

export default TopViewedProducts;