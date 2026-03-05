import { useState, useEffect, useRef, useCallback } from 'react';
import { ActivitySimulator, Scenario, ActivityMap } from '../utils/activitySimulator';

export interface HistoryPoint {
    time: number;
    data: ActivityMap;
}

export function useNeuralActivity() {
    const simulator = useRef(new ActivitySimulator());
    const [activity, setActivity] = useState<ActivityMap>(simulator.current.update());
    const [scenario, setScenario] = useState<Scenario>('relax');
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [history, setHistory] = useState<HistoryPoint[]>([]);

    useEffect(() => {
        simulator.current.setScenario(scenario);
    }, [scenario]);

    useEffect(() => {
        if (!isPlaying) return;

        const intervalId = setInterval(() => {
            const newActivity = simulator.current.update();
            setActivity(newActivity);

            setHistory(prev => {
                // Keep last 40 points for the chart
                const h = [...prev, { time: Date.now(), data: newActivity }];
                if (h.length > 40) h.shift();
                return h;
            });
        }, 400 / speed);

        return () => clearInterval(intervalId);
    }, [isPlaying, speed]);

    return {
        activity,
        scenario,
        setScenario,
        isPlaying,
        togglePlay: useCallback(() => setIsPlaying(p => !p), []),
        speed,
        setSpeed,
        history
    };
}
