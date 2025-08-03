import React from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

interface ProductViewCount {
    date: string;
    cosmeticId: number | null;
    viewCount: number;
    info?: string;
}

interface SimpleLineChartProps {
    data: ProductViewCount[];
    description: string;
    title: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({data, description, title}) => {
    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    const enrichedData = data.map(item => ({
        ...item,
        info: description
    }));

    const maxViewCount = Math.max(...enrichedData.map(item => item.viewCount));
    const domainMax = maxViewCount + maxViewCount * 0.1;

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-3 sm:p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <div className="w-full h-[300px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={enrichedData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 20 // Увеличили отступ снизу
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                            padding={{ bottom: 10 }} // Добавили padding для оси X
                        />
                        <YAxis
                            domain={[0, domainMax]}
                            tickFormatter={(value) => Math.floor(value).toString()}
                            tick={{ fontSize: 12 }}
                            width={40}
                        />
                        <Tooltip
                            content={({active, payload, label}) => (
                                <CustomTooltip
                                    active={active}
                                    payload={payload}
                                    label={label}
                                    description={payload?.[0]?.payload.info}
                                />
                            )}
                            cursor={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="viewCount"
                            stroke="#8884d8"
                            dot={{ r: 3, strokeWidth: 1 }}
                            strokeWidth={2}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const CustomTooltip = ({
                           active,
                           payload,
                           label,
                           description,
                       }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: ProductViewCount }>;
    label?: string;
    description?: string;
}) => {
    if (active && payload && payload.length > 0) {
        const count = payload[0].value;
        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{label}</p>
                <p className="desc text-gray-500 text-sm">
                    {description}: <strong>{count}</strong>
                </p>
            </div>
        );
    }

    return null;
};

export default SimpleLineChart;