import React from 'react';
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { COLORS } from './constants'; // импортируем цвета из файла constants.ts

interface CountItem {
    label: string;
    count: number;
}

const SimplePieChart = ({ data }: { data: CountItem[] }) => (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
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
                <Tooltip />
                <LabelList
                    dataKey="label"
                    position="outside"
                    style={{ fontSize: '10px', fill: '#333' }}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export default SimplePieChart;