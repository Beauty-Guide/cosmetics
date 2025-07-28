import React from 'react';
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from './constants'; // импортируем цвета из файла constants.ts

interface CountItem {
    label: string;
    count: number;
}

interface SimplePieChartProps {
    data: CountItem[];
    title: string;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, title }) => {
    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{title}</h3>
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60} // 添加内半径以创建环形效果
                        labelLine={false} // 关闭标签线
                        label={({ name, value }) => `${name}: ${value}`} // 自定义标签
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload, label }) => (
                            <CustomTooltip
                                active={active}
                                payload={payload}
                                label={label}
                                description={payload?.[0]?.payload.info} // Используйте поле info из данных
                            />
                        )}
                        cursor={false}
                    />
                    <LabelList
                        dataKey="label"
                        position="outside"
                        style={{ fontSize: '10px', fill: '#333' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label, description }) => {
    if (active && payload && payload.length > 0) {
        const count = payload[0]?.value; // Получаем значение count
        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{`${label} : ${count}`}</p>
                <p className="desc text-gray-500 text-sm">{description}</p>
            </div>
        );
    }

    return null;
};

export default SimplePieChart;