export type ROIName =
    | 'prefrontal'
    | 'motor'
    | 'occipital'
    | 'temporal'
    | 'parietal'
    | 'cerebellum';

export const rois: Record<ROIName, { position: [number, number, number]; label: string; }> = {
    prefrontal: { position: [0, 1.5, 3], label: 'Prefrontal' },
    motor: { position: [0, 3, 0], label: 'Motor' },
    parietal: { position: [0, 2.5, -2], label: 'Parietal' },
    temporal: { position: [2, 0, 0], label: 'Temporal' },
    occipital: { position: [0, 0.5, -3.5], label: 'Occipital' },
    cerebellum: { position: [0, -1.5, -2.5], label: 'Cerebellum' },
};
