
import React, { useEffect, useRef, useState } from 'react';

export interface TourStep {
    selector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
    steps: TourStep[];
    isOpen: boolean;
    onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ steps, isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const stepRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && steps[currentStep]) {
            const targetElement = document.querySelector(steps[currentStep].selector);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                setTargetRect(rect);
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
    }, [isOpen, currentStep, steps]);

    if (!isOpen || !targetRect) return null;

    const step = steps[currentStep];
    const { top, left, width, height } = targetRect;

    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${top + height + 10}px`,
        left: `${left + width / 2}px`,
        transform: 'translateX(-50%)',
        zIndex: 10001,
    };
    
    // Adjust position based on prop
    if (step.position === 'top') {
        tooltipStyle.top = `${top - 10}px`;
        tooltipStyle.transform = 'translate(-50%, -100%)';
    } else if (step.position === 'left') {
        tooltipStyle.top = `${top + height / 2}px`;
        tooltipStyle.left = `${left - 10}px`;
        tooltipStyle.transform = 'translate(-100%, -50%)';
    } else if (step.position === 'right') {
        tooltipStyle.top = `${top + height / 2}px`;
        tooltipStyle.left = `${left + width + 10}px`;
        tooltipStyle.transform = 'translateY(-50%)';
    }


    return (
        <div className="fixed inset-0 z-[10000]">
            <div className="absolute inset-0 bg-black/50" onClick={() => currentStep === steps.length -1 ? onClose() : setCurrentStep(s => s + 1)}></div>
            <div
                className="absolute transition-all duration-300 ease-in-out bg-white"
                style={{ top, left, width, height, boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}
            ></div>
            <div ref={stepRef} style={tooltipStyle} className="bg-white p-4 rounded-lg shadow-xl w-80">
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.content}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-400">{currentStep + 1} / {steps.length}</span>
                    <div>
                        {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} className="text-sm font-semibold px-3 py-1">Back</button>}
                        {currentStep < steps.length - 1 ? (
                            <button onClick={() => setCurrentStep(s => s + 1)} className="text-sm font-semibold px-3 py-1 bg-violet-600 text-white rounded">Next</button>
                        ) : (
                            <button onClick={onClose} className="text-sm font-semibold px-3 py-1 bg-violet-600 text-white rounded">Finish</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
