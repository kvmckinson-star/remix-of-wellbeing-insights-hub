import React from 'react';
import type { AssessmentData } from '@/types/assessment';
import { FormField, SectionCard } from './FormField';

interface Props {
  data: AssessmentData;
  onChange: (field: keyof AssessmentData, value: any) => void;
  onNavigate: (tab: string) => void;
  calculatedAge: string;
  calculatedBmi: string;
}

export const EssentialHealthTab: React.FC<Props> = ({ data, onChange, onNavigate, calculatedAge, calculatedBmi }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-primary">Essential Health MOT</h2>
          <p className="text-muted-foreground">Blood pressure, BMI, pulse and lifestyle review</p>
        </div>
      </div>

      {/* Consent Card */}
      <SectionCard title="Patient Consent and Privacy">
        <div className="space-y-3 text-sm text-foreground">
          <p>This assessment records personal and health information for nurse led education and guidance. This is not diagnostic and does not replace GP care.</p>
          <label className="flex items-start gap-3 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.consentGiven}
              onChange={e => {
                onChange('consentGiven', e.target.checked);
                onChange('consentTimestamp', e.target.checked ? new Date().toISOString() : '');
              }}
              className="mt-1 h-4 w-4 rounded border-border text-primary"
            />
            <span>
              I consent to Corezen Health collecting and processing my personal and health information for the purpose of this nurse led wellbeing assessment, education and guidance. I understand this assessment is not diagnostic and does not replace GP care. I understand my data will be handled in line with UK GDPR.
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            Consent timestamp: {data.consentGiven ? new Date(data.consentTimestamp).toLocaleString('en-GB') : 'Not recorded'}
          </p>
          <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
            <p><strong>Privacy notice summary.</strong> Data is used to produce your report and to support follow up. You can request access, correction and deletion of your data. Contact info@corezenhealth.co.uk.</p>
          </div>
        </div>
      </SectionCard>

      {/* Client Information */}
      <SectionCard title="Client Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="clientId" label="Client ID" type="text" value={data.clientId} onChange={() => {}} readOnly />
          <FormField id="assessmentDate" label="Date of Assessment" type="text" value={(() => {
            // Format as DD/MM/YYYY
            if (!data.assessmentDate) return '';
            const parts = data.assessmentDate.split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return data.assessmentDate;
          })()} onChange={() => {}} readOnly />
          <FormField id="clientName" label="Client Name" type="text" value={data.clientName} onChange={v => onChange('clientName', v)} placeholder="Full name" />
          <FormField id="dateOfBirth" label="Date of Birth (DD/MM/YYYY)" type="text" value={data.dateOfBirth} onChange={v => onChange('dateOfBirth', v)} placeholder="DD/MM/YYYY" />
          <FormField id="age" label="Age" type="text" value={calculatedAge} onChange={() => {}} readOnly />
          <FormField id="contactNumber" label="Contact Number" type="tel" value={data.contactNumber} onChange={v => onChange('contactNumber', v)} />
          <FormField id="email" label="Email" type="email" value={data.email} onChange={v => onChange('email', v)} />
          <FormField id="gpPractice" label="GP Practice" type="text" value={data.gpPractice} onChange={v => onChange('gpPractice', v)} />
        </div>
      </SectionCard>

      {/* Vital Signs */}
      <SectionCard title="Vital Signs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="bpSystolic" label="Blood Pressure (Systolic)" type="number" value={data.bpSystolic} onChange={v => onChange('bpSystolic', v)} placeholder="e.g. 120" />
          <FormField id="bpDiastolic" label="Blood Pressure (Diastolic)" type="number" value={data.bpDiastolic} onChange={v => onChange('bpDiastolic', v)} placeholder="e.g. 80" />
          <FormField id="pulseRate" label="Pulse Rate (bpm)" type="number" value={data.pulseRate} onChange={v => onChange('pulseRate', v)} placeholder="e.g. 72" />
          <FormField id="height" label="Height (cm)" type="number" value={data.height} onChange={v => onChange('height', v)} placeholder="e.g. 170" />
          <FormField id="weight" label="Weight (kg)" type="number" value={data.weight} onChange={v => onChange('weight', v)} placeholder="e.g. 75" />
          <FormField id="bmi" label="BMI" type="text" value={calculatedBmi} onChange={() => {}} readOnly hint="Calculated automatically from height and weight" />
        </div>
      </SectionCard>

      {/* Cardiovascular Risk */}
      <SectionCard title="Cardiovascular Risk Assessment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="smoker" label="Current smoker" type="select" value={data.smoker} onChange={v => onChange('smoker', v)} options={['No', 'Yes', 'Ex-smoker']} />
          <FormField id="familyHistory" label="Family history of heart disease" type="select" value={data.familyHistory} onChange={v => onChange('familyHistory', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="diabetes" label="Known diabetes" type="select" value={data.diabetes} onChange={v => onChange('diabetes', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="bpMedication" label="Blood pressure medication" type="select" value={data.bpMedication} onChange={v => onChange('bpMedication', v)} options={['No', 'Yes']} />
          <FormField id="exercise" label="Regular exercise" type="select" value={data.exercise} onChange={v => onChange('exercise', v)} options={['No', 'Yes']} />
          <FormField id="exerciseFrequency" label="Exercise frequency" type="select" value={data.exerciseFrequency} onChange={v => onChange('exerciseFrequency', v)} options={['None', '1 to 2 times per week', '3 to 4 times per week', '5 or more times per week']} />
          <FormField id="alcohol" label="Drinks alcohol" type="select" value={data.alcohol} onChange={v => onChange('alcohol', v)} options={['No', 'Yes']} />
          <FormField id="alcoholUnits" label="Alcohol units per week" type="number" value={data.alcoholUnits} onChange={v => onChange('alcoholUnits', v)} placeholder="e.g. 10" />
        </div>
      </SectionCard>

      {/* Clinical Context */}
      <SectionCard title="Clinical and Lifestyle Context">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="mobilityLevel" label="Mobility level" type="select" value={data.mobilityLevel} onChange={v => onChange('mobilityLevel', v)} options={['No limitations', 'Mild limitation', 'Limited mobility', 'Uses walking aid', 'Wheelchair user', 'Housebound']} />
          <FormField id="activityBarriers" label="Activity barriers" type="select" value={data.activityBarriers} onChange={v => onChange('activityBarriers', v)} options={['None', 'Pain', 'Breathlessness', 'Fatigue', 'Time', 'Motivation', 'Other']} />
          <FormField id="dietPattern" label="Diet pattern" type="select" value={data.dietPattern} onChange={v => onChange('dietPattern', v)} options={['No special diet', 'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher', 'Other']} />
          <FormField id="diabetesType" label="Diabetes type" type="select" value={data.diabetesType} onChange={v => onChange('diabetesType', v)} options={['No diabetes', 'Type 1', 'Type 2', 'Pre-diabetes', 'Gestational', 'Not sure']} />
          <FormField id="knownHypertension" label="Known hypertension" type="select" value={data.knownHypertension} onChange={v => onChange('knownHypertension', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="knownHighCholesterol" label="Known high cholesterol" type="select" value={data.knownHighCholesterol} onChange={v => onChange('knownHighCholesterol', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="sleepApnoea" label="Sleep apnoea" type="select" value={data.sleepApnoea} onChange={v => onChange('sleepApnoea', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="pregnancyStatus" label="Pregnancy or postpartum" type="select" value={data.pregnancyStatus} onChange={v => onChange('pregnancyStatus', v)} options={['Not applicable', 'Pregnant', 'Postpartum (under 12 months)']} />
          <FormField id="shiftWork" label="Shift work" type="select" value={data.shiftWork} onChange={v => onChange('shiftWork', v)} options={['No', 'Yes, nights', 'Yes, rotating', 'Yes, other']} />
          <FormField id="nightsPerMonth" label="Night shifts per month" type="select" value={data.nightsPerMonth} onChange={v => onChange('nightsPerMonth', v)} options={['Not applicable', '1 to 4', '5 to 10', '11 or more']} />
          <FormField id="snoring" label="Snoring" type="select" value={data.snoring} onChange={v => onChange('snoring', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="witnessedApnoea" label="Witnessed breathing pauses at night" type="select" value={data.witnessedApnoea} onChange={v => onChange('witnessedApnoea', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="daytimeSleepiness" label="Daytime sleepiness (0-10)" type="select" value={data.daytimeSleepiness} onChange={v => onChange('daytimeSleepiness', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
          <FormField id="restlessLegs" label="Restless legs symptoms at night" type="select" value={data.restlessLegs} onChange={v => onChange('restlessLegs', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="lastCaffeineTime" label="Last caffeine time on a typical day" type="select" value={data.lastCaffeineTime} onChange={v => onChange('lastCaffeineTime', v)} options={['No caffeine', 'Before 12:00', '12:00 to 14:00', '14:00 to 16:00', 'After 16:00']} />
          <FormField id="homeBpMonitor" label="Home blood pressure monitor available" type="select" value={data.homeBpMonitor} onChange={v => onChange('homeBpMonitor', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="cvEventHistory" label="Cardiovascular event history" type="select" value={data.cvEventHistory} onChange={v => onChange('cvEventHistory', v)} options={['No known event', 'Previous heart attack', 'Previous stroke or TIA', 'Angina', 'Other, GP managed', 'Not sure']} />
          <FormField id="kidneyDisease" label="Kidney disease" type="select" value={data.kidneyDisease} onChange={v => onChange('kidneyDisease', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="familyHistoryEarly" label="Family history of early heart disease" type="select" value={data.familyHistoryEarly} onChange={v => onChange('familyHistoryEarly', v)} options={['No', 'Yes', 'Not sure']} />
          <FormField id="alcoholUnitsWeek" label="Alcohol intake per week, approximate" type="select" value={data.alcoholUnitsWeek} onChange={v => onChange('alcoholUnitsWeek', v)} options={['0', '1 to 7', '8 to 14', '15 to 21', '22 or more']} />
          <FormField id="foodAccess" label="Food access and cooking" type="select" value={data.foodAccess} onChange={v => onChange('foodAccess', v)} options={['No concerns', 'Limited budget', 'Limited cooking facilities', 'Low appetite or poor intake', 'Not sure or prefer not to say']} />
          <FormField id="falls12m" label="Falls in the last 12 months" type="select" value={data.falls12m} onChange={v => onChange('falls12m', v)} options={['No', 'Yes, one fall', 'Yes, two or more']} />
          <FormField id="painLimitingMovement" label="Pain limiting movement, 0 to 10" type="select" value={data.painLimitingMovement} onChange={v => onChange('painLimitingMovement', v)} options={['0','1','2','3','4','5','6','7','8','9','10']} />
          <FormField id="upperLimbFunction" label="Upper limb function for chair based exercise" type="select" value={data.upperLimbFunction} onChange={v => onChange('upperLimbFunction', v)} options={['No limitation', 'Mild limitation', 'Moderate limitation', 'Severe limitation']} />
          <FormField id="otherContext" label="Other relevant context, optional" type="text" value={data.otherContext} onChange={v => onChange('otherContext', v)} placeholder="Example: chronic pain, COPD, long Covid, mobility restrictions, dietary restrictions" fullWidth />
        </div>
      </SectionCard>

      <div className="flex gap-4 justify-end no-print">
        <button onClick={() => onNavigate('wellbeing')} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          Continue to Wellbeing Review →
        </button>
        <button onClick={() => onNavigate('report')} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
          Generate Report
        </button>
      </div>
    </div>
  );
};
