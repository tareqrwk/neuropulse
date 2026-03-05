export type ROIName =
    | 'prefrontal'
    | 'motor'
    | 'occipital'
    | 'temporal'
    | 'parietal'
    | 'cerebellum';

export const rois: Record<ROIName, { position: [number, number, number]; label: string; }> = {
    prefrontal: { position: [0, 0.3, 0.8], label: 'Prefrontal' },
    motor: { position: [0, 0.8, 0], label: 'Motor' },
    parietal: { position: [0, 0.6, -0.6], label: 'Parietal' },
    temporal: { position: [0.7, -0.1, 0], label: 'Temporal' },
    occipital: { position: [0, 0.1, -0.9], label: 'Occipital' },
    cerebellum: { position: [0, -0.4, -0.6], label: 'Cerebellum' },
};
