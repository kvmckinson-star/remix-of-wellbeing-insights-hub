import React from 'react';
import type { AssessmentData, CalculatedValues } from '@/types/assessment';
import { FormField, SectionCard, CheckboxField } from './FormField';

interface Props {
  data: AssessmentData;
  calc: CalculatedValues;
  onChange: (field: keyof AssessmentData, value: any) => void;
  onNavigate: (tab: string) => void;
}

const CHALDER_QUESTIONS = [
  { id: '1', label: 'Do you have problems with tiredness', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '2', label: 'Do you need to rest more', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '3', label: 'Do you feel sleepy or drowsy', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '4', label: 'Do you have problems starting things', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '5', label: 'Do you lack energy', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '6', label: 'Do you have less strength in your muscles', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '7', label: 'Do you feel weak', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '8', label: 'Do you have difficulty concentrating', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '9', label: 'Do you make slips of the tongue when speaking', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '10', label: 'Do you find it more difficult to find the right word', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { id: '11', label: 'How is your memory', options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
];

export const FatigueTab: React.FC<Props> = ({ data, calc, onChange, onNavigate }) => {
  const updateChalder = (id: string, value: string) => {
    onChange('chalder', { ...data.chalder, [id]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-primary">Fatigue Review</h2>
          <p className="text-muted-foreground">Detailed fatigue and energy assessment</p>
        </div>
      </div>

      <div className="rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-foreground">
        <strong>Important:</strong> This includes ALL sections from Essential Health MOT. Complete that form first then add the sections below.
      </div>

      <SectionCard title="Chalder Fatigue Scale (Validated Assessment)">
        <p className="text-sm text-muted-foreground mb-4">
          Rate each area from <strong>0</strong> (better than usual) to <strong>10</strong> (much worse than usual). This is a validated clinical tool.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHALDER_QUESTIONS.map(q => (
            <FormField
              key={q.id}
              id={`chalder_${q.id}`}
              label={q.label}
              type="select"
              value={data.chalder[q.id] || ''}
              onChange={val => updateChalder(q.id, val)}
              options={q.options}
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
          <FormField id="fatigueScore" label="Total Fatigue Score (out of 110)" type="text" value={calc.fatigueScore} onChange={() => {}} readOnly hint="Calculated automatically from Chalder scale above" />
          <FormField id="fatigueLevel" label="Fatigue Level" type="text" value={calc.fatigueLevel} onChange={() => {}} readOnly hint="Calculated automatically" />
        </div>
      </SectionCard>

      <SectionCard title="Sleep and Recovery Review">
        <p className="text-sm text-muted-foreground mb-4">These questions support safer and more relevant fatigue advice.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="fr_sleepHours" label="Average hours of sleep per night" type="number" value={data.fr_sleepHours} onChange={v => onChange('fr_sleepHours', v)} min={0} max={24} />
          <FormField id="fr_sleepQuality" label="Sleep quality" type="select" value={data.fr_sleepQuality} onChange={v => onChange('fr_sleepQuality', v)} options={['Very poor', 'Poor', 'Fair', 'Good', 'Very good']} />
          <FormField id="fr_diffFallingAsleep" label="Difficulty falling asleep" type="select" value={data.fr_diffFallingAsleep} onChange={v => onChange('fr_diffFallingAsleep', v)} options={['Yes', 'No']} />
          <FormField id="fr_wakeNight" label="Wake during the night" type="select" value={data.fr_wakeNight} onChange={v => onChange('fr_wakeNight', v)} options={['0', '1-2', '3-4', '5+']} />
          <FormField id="fr_refreshedWaking" label="Feel refreshed upon waking" type="select" value={data.fr_refreshedWaking} onChange={v => onChange('fr_refreshedWaking', v)} options={['Yes', 'No']} />
        </div>
      </SectionCard>

      <SectionCard title="Lifestyle and Contributing Factors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="fr_caffeineIntake" label="Daily caffeine intake (cups)" type="select" value={data.fr_caffeineIntake} onChange={v => onChange('fr_caffeineIntake', v)} options={['None', '1', '2', '3', '4+']} />
          <FormField id="fr_waterIntake" label="Water intake per day" type="select" value={data.fr_waterIntake} onChange={v => onChange('fr_waterIntake', v)} options={['Under 1L', '1-1.5L', '1.5-2L', '2-3L', 'Over 3L']} />
          <FormField id="fr_stressLevel" label="Stress level (0 to 10)" type="select" value={data.fr_stressLevel} onChange={v => onChange('fr_stressLevel', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
          <FormField id="dietQuality" label="Diet quality (0 to 10)" type="select" value={data.dietQuality} onChange={v => onChange('dietQuality', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
          <FormField id="overallHealth" label="Overall self-rated health" type="select" value={data.overallHealth} onChange={v => onChange('overallHealth', v)} options={['Good', 'Fair', 'Poor', 'Very poor']} />
          <FormField id="alcoholIntake" label="Alcohol intake per day" type="select" value={data.alcoholIntake} onChange={v => onChange('alcoholIntake', v)} options={['None', '1 to 2 drinks', '3 to 4 drinks', '5 or more drinks']} />
        </div>
      </SectionCard>

      <SectionCard title="Daytime Functioning and Energy Patterns">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="fr_afternoonCrash" label="Do you experience an afternoon energy crash" type="select" value={data.fr_afternoonCrash} onChange={v => onChange('fr_afternoonCrash', v)} options={['Yes, severe', 'Yes, moderate', 'Yes, mild', 'No']} />
          <FormField id="fr_urgeNap" label="How often do you feel the urge to nap during the day" type="select" value={data.fr_urgeNap} onChange={v => onChange('fr_urgeNap', v)} options={['Daily', 'Most days', 'Sometimes', 'Rarely', 'Never']} />
          <FormField id="fr_brainFog" label="Do you experience brain fog or mental fatigue" type="select" value={data.fr_brainFog} onChange={v => onChange('fr_brainFog', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="fr_needCaffeine" label="How often do you need caffeine to function" type="select" value={data.fr_needCaffeine} onChange={v => onChange('fr_needCaffeine', v)} options={['Never', 'Rarely', 'Sometimes', 'Often', 'Always']} />
          <FormField id="fr_concentrationDay" label="How is your concentration during the day (0 to 10)" type="select" value={data.fr_concentrationDay} onChange={v => onChange('fr_concentrationDay', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
          <FormField id="fr_motivationTasks" label="How is your motivation to complete daily tasks (0 to 10)" type="select" value={data.fr_motivationTasks} onChange={v => onChange('fr_motivationTasks', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
        </div>
      </SectionCard>

      <SectionCard title="Physical Symptoms and Post Exertional Symptoms">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="fr_muscleAches" label="Do you experience muscle aches or pain" type="select" value={data.fr_muscleAches} onChange={v => onChange('fr_muscleAches', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="fr_jointPain" label="Do you have joint pain or stiffness" type="select" value={data.fr_jointPain} onChange={v => onChange('fr_jointPain', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="fr_symptomsWorseAfterActivity" label="After physical activity, do symptoms worsen" type="select" value={data.fr_symptomsWorseAfterActivity} onChange={v => onChange('fr_symptomsWorseAfterActivity', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="fr_recoveryTime" label="If symptoms worsen, how long until recovery" type="select" value={data.fr_recoveryTime} onChange={v => onChange('fr_recoveryTime', v)} options={['Not applicable', 'Under 24 hours', '1-2 days', '3-7 days', 'Over 7 days']} />
          <FormField id="fr_activityCrashes" label="Do you experience crashes after activity" type="select" value={data.fr_activityCrashes} onChange={v => onChange('fr_activityCrashes', v)} options={['No', 'Yes', 'Not sure']} />
        </div>
      </SectionCard>

      <SectionCard title="Fatigue History and Impact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="fr_durationFatigue" label="How long has fatigue been a problem" type="select" value={data.fr_durationFatigue} onChange={v => onChange('fr_durationFatigue', v)} options={['Under 4 weeks', '1-3 months', '3-6 months', '6-12 months', 'Over 12 months']} />
          <FormField id="fr_trendFatigue" label="Is your fatigue getting worse, better or stable" type="select" value={data.fr_trendFatigue} onChange={v => onChange('fr_trendFatigue', v)} options={['Worse', 'Better', 'Stable', 'Variable']} />
          <FormField id="fr_worseFatigue" label="What makes your fatigue worse" type="text" value={data.fr_worseFatigue} onChange={v => onChange('fr_worseFatigue', v)} placeholder="Example: poor sleep, stress, activity, illness" />
          <FormField id="fr_betterFatigue" label="What makes your fatigue better" type="text" value={data.fr_betterFatigue} onChange={v => onChange('fr_betterFatigue', v)} placeholder="Example: rest, pacing, hydration, routine" />
          <FormField id="fr_prioritiesActions" label="Key priorities discussed and agreed actions" type="text" value={data.fr_prioritiesActions} onChange={v => onChange('fr_prioritiesActions', v)} placeholder="Brief agreed actions for the next 7 days" fullWidth />
        </div>
      </SectionCard>

      <SectionCard title="Urinalysis (Optional)">
        <p className="text-sm text-muted-foreground mb-4">Complete if urine dipstick screening was performed. All fields are optional.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormField id="urLeukocytes" label="Leukocytes" type="select" value={data.urLeukocytes} onChange={v => onChange('urLeukocytes', v)} options={['Negative', 'Trace', '+1 (Small)', '+2 (Moderate)', '+3 (Large)']} />
          <FormField id="urNitrites" label="Nitrites" type="select" value={data.urNitrites} onChange={v => onChange('urNitrites', v)} options={['Negative', 'Positive']} />
          <FormField id="urProtein" label="Protein" type="select" value={data.urProtein} onChange={v => onChange('urProtein', v)} options={['Negative', 'Trace', '+1 (30 mg/dL)', '+2 (100 mg/dL)', '+3 (300 mg/dL)', '+4 (>1000 mg/dL)']} />
          <FormField id="urBlood" label="Blood" type="select" value={data.urBlood} onChange={v => onChange('urBlood', v)} options={['Negative', 'Trace', '+1 (Small)', '+2 (Moderate)', '+3 (Large)']} />
          <FormField id="urGlucose" label="Glucose" type="select" value={data.urGlucose} onChange={v => onChange('urGlucose', v)} options={['Negative', 'Trace', '+1 (100 mg/dL)', '+2 (250 mg/dL)', '+3 (500 mg/dL)', '+4 (>1000 mg/dL)']} />
          <FormField id="urKetones" label="Ketones" type="select" value={data.urKetones} onChange={v => onChange('urKetones', v)} options={['Negative', 'Trace', '+1 (Small)', '+2 (Moderate)', '+3 (Large)']} />
          <FormField id="urBilirubin" label="Bilirubin" type="select" value={data.urBilirubin} onChange={v => onChange('urBilirubin', v)} options={['Negative', '+1 (Small)', '+2 (Moderate)', '+3 (Large)']} />
          <FormField id="urUrobilinogen" label="Urobilinogen" type="select" value={data.urUrobilinogen} onChange={v => onChange('urUrobilinogen', v)} options={['Normal (0.2-1.0)', 'Raised (>1.0)']} />
          <FormField id="urpH" label="pH" type="select" value={data.urpH} onChange={v => onChange('urpH', v)} options={['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0']} />
          <FormField id="urSpecificGravity" label="Specific gravity" type="select" value={data.urSpecificGravity} onChange={v => onChange('urSpecificGravity', v)} options={['1.000', '1.005', '1.010', '1.015', '1.020', '1.025', '1.030']} />
        </div>
        <div className="mt-4">
          <FormField id="urNotes" label="Additional urinalysis notes (optional)" type="textarea" value={data.urNotes} onChange={v => onChange('urNotes', v)} placeholder="Any additional observations or context" fullWidth />
        </div>
      </SectionCard>

      <div className="flex gap-4 justify-end no-print">
        <button onClick={() => onNavigate('wellbeing')} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          ← Back to Wellbeing Review
        </button>
        <button onClick={() => onNavigate('report')} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
          Generate Report
        </button>
      </div>
    </div>
  );
};
