import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { HistoryPoint } from '../hooks/useNeuralActivity';

interface ActivityChartProps {
    history: HistoryPoint[];
}

const COLORS = {
    prefrontal: '#3b82f6', // blue
    motor: '#ef4444',      // red
    occipital: '#eab308',  // yellow
    temporal: '#a855f7',   // purple
    parietal: '#22c55e',   // green
    cerebellum: '#f97316'  // orange
};

export const ActivityChart: React.FC<ActivityChartProps> = ({ history }) => {
    const data = history.map(item => ({
        time: item.time,
        ...item.data
    }));

    return (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex flex-col gap-2 shadow-xl flex-1 min-h-[250px]">
            <h2 className="text-zinc-100 font-semibold text-lg">Neural Signal Amplitude</h2>
            <div className="flex-1 w-full h-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 1.0]} stroke="#52525b" fontSize={11} tickFormatter={(v) => v.toFixed(1)} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#e4e4e7' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value: any) => Number(value).toFixed(2)}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                        {Object.keys(COLORS).map((key) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[key as keyof typeof COLORS]}
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
