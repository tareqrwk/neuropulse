import { ROIName } from './roiPositions';

export type Scenario = 'focus' | 'relax' | 'motor';

export type ActivityMap = Record<ROIName, number>;

export class ActivitySimulator {
    private activity: ActivityMap;
    private currentScenario: Scenario;
    private step: number = 0;

    constructor() {
        this.currentScenario = 'relax';
        this.activity = {
            prefrontal: 0.1,
            motor: 0.1,
            occipital: 0.1,
            temporal: 0.1,
            parietal: 0.1,
            cerebellum: 0.1,
        };
    }

    public setScenario(scenario: Scenario) {
        this.currentScenario = scenario;
        this.step = 0; // reset phase when scenario changes
    }

    public getScenario() {
        return this.currentScenario;
    }

    public update(): ActivityMap {
        this.step += 0.2;

        // Decay all activity slowly
        for (const key in this.activity) {
            let k = key as ROIName;
            this.activity[k] *= 0.85;
        }

        // Add noise to all regions
        for (const key in this.activity) {
            let k = key as ROIName;
            this.activity[k] += (Math.random() - 0.5) * 0.08;
        }

        // Apply scenario-specific propagation patterns
        const time = this.step;

        if (this.currentScenario === 'focus') {
            // Prefrontal -> Parietal -> Motor (faster oscillations, strong prefrontal)
            this.activity.prefrontal += Math.max(0, Math.sin(time * 2)) * 0.5 * (Math.random() * 0.5 + 0.5);
            this.activity.parietal += Math.max(0, Math.sin(time * 2 - 1.5)) * 0.4;
            this.activity.motor += Math.max(0, Math.sin(time * 2 - 3)) * 0.3;
        } else if (this.currentScenario === 'relax') {
            // Occipital -> Temporal -> Parietal (slower, smoother)
            this.activity.occipital += Math.max(0, Math.sin(time * 0.8)) * 0.3;
            this.activity.temporal += Math.max(0, Math.sin(time * 0.8 - 1)) * 0.25;
            this.activity.parietal += Math.max(0, Math.sin(time * 0.8 - 2)) * 0.2;
        } else if (this.currentScenario === 'motor') {
            // Motor -> Cerebellum -> Parietal (bursty)
            if (Math.random() > 0.75) {
                this.activity.motor += 0.6 + Math.random() * 0.4;
            }
            // Simulate delayed propagation by scaling motor activity
            this.activity.cerebellum += this.activity.motor * 0.5;
            this.activity.parietal += this.activity.motor * 0.3;
        }

        // Enforce bounds (0.1 to 1.0)
        for (const key in this.activity) {
            let k = key as ROIName;
            this.activity[k] = Math.max(0.1, Math.min(1.0, this.activity[k]));
        }

        return { ...this.activity };
    }
}
