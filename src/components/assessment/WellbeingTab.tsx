import React from 'react';
import type { AssessmentData } from '@/types/assessment';
import { FormField, SectionCard, CheckboxField } from './FormField';

interface Props {
  data: AssessmentData;
  onChange: (field: keyof AssessmentData, value: any) => void;
  onNavigate: (tab: string) => void;
}

const STRESSOR_OPTIONS = [
  'Work / workload',
  'Family / relationships',
  'Health concerns',
  'Finances',
  'Caring responsibilities',
  'Other',
];

export const WellbeingTab: React.FC<Props> = ({ data, onChange, onNavigate }) => {
  const toggleStressor = (stressor: string) => {
    const current = data.wellbeingStressors || [];
    if (current.includes(stressor)) {
      onChange('wellbeingStressors', current.filter(s => s !== stressor));
    } else {
      onChange('wellbeingStressors', [...current, stressor]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-primary">Complete Wellbeing Review</h2>
          <p className="text-muted-foreground">Comprehensive review with lipid screening</p>
        </div>
      </div>

      <div className="rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-foreground">
        <strong>Important:</strong> This includes ALL sections from Essential Health MOT. Complete that form first then add the sections below.
      </div>

      <SectionCard title="Overall Wellbeing Check-in">
        <p className="text-sm text-muted-foreground mb-4">
          Rate each area from <strong>0</strong> (very poor) to <strong>10</strong> (excellent). This helps personalise your next steps plan.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="wbEnergy" label="Energy and fatigue" type="number" value={data.wbEnergy} onChange={v => onChange('wbEnergy', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbSleep" label="Sleep quality" type="number" value={data.wbSleep} onChange={v => onChange('wbSleep', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbMood" label="Mood and stress" type="number" value={data.wbMood} onChange={v => onChange('wbMood', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbActivity" label="Physical activity" type="number" value={data.wbActivity} onChange={v => onChange('wbActivity', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbNutrition" label="Nutrition" type="number" value={data.wbNutrition} onChange={v => onChange('wbNutrition', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbSocial" label="Social connection" type="number" value={data.wbSocial} onChange={v => onChange('wbSocial', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbStress" label="Stress management" type="number" value={data.wbStress} onChange={v => onChange('wbStress', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbWorkLife" label="Work-life balance" type="number" value={data.wbWorkLife} onChange={v => onChange('wbWorkLife', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbPurpose" label="Sense of purpose" type="number" value={data.wbPurpose} onChange={v => onChange('wbPurpose', v)} min={0} max={10} placeholder="0–10" />
          <FormField id="wbLifeSatisfaction" label="Overall life satisfaction" type="number" value={data.wbLifeSatisfaction} onChange={v => onChange('wbLifeSatisfaction', v)} min={0} max={10} placeholder="0–10" />
        </div>

        <div className="mt-4">
          <FormField id="wellbeingPriorities" label="Key priorities the client wants to work on" type="textarea" value={data.wellbeingPriorities} onChange={v => onChange('wellbeingPriorities', v)} placeholder="e.g. improve sleep routine, increase daily steps, reduce sugary snacks..." fullWidth />
        </div>
      </SectionCard>

      <SectionCard title="Wellbeing Deep Dive">
        <p className="text-xs text-muted-foreground mb-3">These responses personalise your wellbeing section and your 4 week plan in the report.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="wellbeingMood" label="Mood" type="select" value={data.wellbeingMood} onChange={v => onChange('wellbeingMood', v)} options={['Mostly stable', 'Low mood', 'Anxious / worried', 'Low mood and anxious']} />
          <FormField id="wellbeingMoodFrequency" label="How often does this affect you" type="select" value={data.wellbeingMoodFrequency} onChange={v => onChange('wellbeingMoodFrequency', v)} options={['Rarely', 'Some days', 'Most days', 'Every day']} />

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Main stress drivers (tick any that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {STRESSOR_OPTIONS.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(data.wellbeingStressors || []).includes(s)}
                    onChange={() => toggleStressor(s)}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <FormField id="wellbeingRelaxation" label="Relaxation / switch-off time" type="select" value={data.wellbeingRelaxation} onChange={v => onChange('wellbeingRelaxation', v)} options={['None at the moment', 'Occasionally', 'Most days', 'Daily']} />
          <FormField id="wellbeingSocialSupport" label="Social support" type="select" value={data.wellbeingSocialSupport} onChange={v => onChange('wellbeingSocialSupport', v)} options={['Strong support network', 'Some support', 'Limited support / feel isolated']} />
          <FormField id="wellbeingMindfulness" label="Would you be open to mindfulness" type="select" value={data.wellbeingMindfulness} onChange={v => onChange('wellbeingMindfulness', v)} options={['Yes', 'No', 'Already do it']} />
          <FormField id="wellbeingBreathing" label="Would you be open to a breathing exercise" type="select" value={data.wellbeingBreathing} onChange={v => onChange('wellbeingBreathing', v)} options={['Yes', 'No', 'Already do it']} />
          <FormField id="workPattern" label="Work pattern" type="select" value={data.workPattern} onChange={v => onChange('workPattern', v)} options={['Day shifts', 'Night shifts', 'Rotating shifts', 'Not working / retired']} />
        </div>
      </SectionCard>

      {/* CardioChek lipid screening - ONLY on this tab */}
      <SectionCard title="CardioChek Lipid Screening">
        <p className="text-sm text-muted-foreground mb-4">Enter results if taken today.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <FormField id="totalCholesterol" label="Total Cholesterol (mmol/L)" type="number" value={data.totalCholesterol} onChange={v => onChange('totalCholesterol', v)} placeholder="e.g. 4.8" step="0.1" />
          <FormField id="ldlCholesterol" label="LDL Cholesterol (mmol/L)" type="number" value={data.ldlCholesterol} onChange={v => onChange('ldlCholesterol', v)} placeholder="e.g. 2.6" step="0.1" />
          <FormField id="hdlCholesterol" label="HDL Cholesterol (mmol/L)" type="number" value={data.hdlCholesterol} onChange={v => onChange('hdlCholesterol', v)} placeholder="e.g. 1.3" step="0.1" />
          <FormField id="triglycerides" label="Triglycerides (mmol/L)" type="number" value={data.triglycerides} onChange={v => onChange('triglycerides', v)} placeholder="e.g. 1.2" step="0.1" />
          <FormField id="glucose" label="Glucose (mmol/L)" type="number" value={data.glucose} onChange={v => onChange('glucose', v)} placeholder="e.g. 5.1" step="0.1" />
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <CheckboxField id="lipidsFasting" label="Fasting sample" checked={data.lipidsFasting} onChange={v => onChange('lipidsFasting', v)} />
          <CheckboxField id="lipidsOnStatin" label="On cholesterol lowering medication" checked={data.lipidsOnStatin} onChange={v => onChange('lipidsOnStatin', v)} />
        </div>
      </SectionCard>

      <div className="flex gap-4 justify-end no-print">
        <button onClick={() => onNavigate('essential')} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          ← Back to Essential MOT
        </button>
        <button onClick={() => onNavigate('fatigue')} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          Continue to Fatigue Review →
        </button>
        <button onClick={() => onNavigate('report')} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
          Generate Report
        </button>
      </div>
    </div>
  );
};
