import React, { useMemo } from 'react';
import type { AssessmentData, CalculatedValues } from '@/types/assessment';
import { getStatusColor } from '@/utils/calculations';
import { adviceBloodPressure, adviceBMI, advicePulse, adviceCholesterol, adviceFatigue, adviceWellbeing, adviceContext, advicePriority, adviceUrinalysis, cleanAdviceText } from '@/utils/advice';
import corezenLogo from '@/assets/corezen-logo.png';

interface Props {
  data: AssessmentData;
  calc: CalculatedValues;
  onNavigate: (tab: string) => void;
}

const AdviceBlock: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="space-y-3 mt-4">
    {items.map((item, i) => (
      <p key={i} className="text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: cleanAdviceText(item) }} />
    ))}
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; unit?: string; sub?: string }> = ({ label, value, unit, sub }) => (
  <div className="border border-border rounded-xl p-3 bg-card">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-lg font-extrabold text-foreground mt-1">
      {value || '—'} {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
    </div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

const ReportSection: React.FC<{ title: string; tag?: string; tagColor?: string; children: React.ReactNode }> = ({ title, tag, tagColor, children }) => (
  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-5 print:shadow-none print:border-border/50">
    <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3 mb-4">
      <span className="text-xs font-extrabold tracking-widest uppercase text-foreground">{title}</span>
      {tag && (
        <span className={`text-xs font-bold tracking-wide px-3 py-1.5 rounded-full bg-primary/10 ${tagColor || 'text-primary'}`}>
          {tag}
        </span>
      )}
    </div>
    {children}
  </div>
);

export const ReportTab: React.FC<Props> = ({ data, calc, onNavigate }) => {
  const hasBP = !!(data.bpSystolic && data.bpDiastolic);
  const hasBMI = !!calc.bmi;
  const hasPulse = !!data.pulseRate;
  const hasChol = !!data.totalCholesterol;
  const hasFatigue = !!calc.fatigueScore;
  const hasWellbeing = !!calc.wellbeingAverage;
  const urinalysisLines = adviceUrinalysis(data);
  const hasUrinalysis = urinalysisLines.length > 0;

  const contextLines = useMemo(() => adviceContext(data), [data]);
  const hasContext = contextLines.length > 0;
  const hasAnyResults = hasBP || hasBMI || hasPulse || hasChol || hasFatigue || hasWellbeing || hasContext || hasUrinalysis;

  if (!data.consentGiven) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary no-print">Client Report</h2>
        <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded">
          <p className="text-sm">Patient consent is required before generating a report. Please tick consent in the Essential Health MOT tab.</p>
        </div>
      </div>
    );
  }

  if (!data.clientName) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary no-print">Client Report</h2>
        <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded">
          <p className="text-sm">Please complete at least the client name before generating a report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-primary">Client Report</h2>
        <button onClick={() => window.print()} className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          Print / Save as PDF
        </button>
      </div>

      {/* Report Header */}
      <div className="report-header-gradient rounded-2xl p-5 flex items-center gap-4">
        <img src={corezenLogo} alt="Corezen Health" className="h-12 w-auto object-contain bg-primary-foreground rounded-lg p-1" />
        <div>
          <h2 className="text-xl font-bold text-primary-foreground">Your Corezen Health Assessment Report</h2>
          <p className="text-sm text-primary-foreground/80 mt-1">Personalised health summary with evidence based education, practical guidance and GP referral where appropriate.</p>
        </div>
      </div>

      {/* Client Meta */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Client name</div>
          <div className="text-sm font-semibold text-foreground mt-1">{data.clientName || 'Not provided'}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Assessment date</div>
          <div className="text-sm font-semibold text-foreground mt-1">{(() => {
            if (!data.assessmentDate) return new Date().toLocaleDateString('en-GB');
            const parts = data.assessmentDate.split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return data.assessmentDate;
          })()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Age</div>
          <div className="text-sm font-semibold text-foreground mt-1">{calc.age || 'N/A'}</div>
        </div>
      </div>

      {/* Context Summary */}
      {hasContext && (
        <div className="bg-muted/50 p-4 rounded-xl">
          <p className="font-semibold text-sm text-foreground mb-2">Context used to tailor advice</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            {data.mobilityLevel && data.mobilityLevel !== 'No limitations' && <li><strong>Mobility:</strong> {data.mobilityLevel}</li>}
            {data.dietPattern && data.dietPattern !== 'No special diet' && <li><strong>Diet:</strong> {data.dietPattern}</li>}
            {data.diabetesType && data.diabetesType !== 'No diabetes' && data.diabetesType !== 'Not sure' && <li><strong>Diabetes:</strong> {data.diabetesType}</li>}
            {data.sleepApnoea === 'Yes' && <li><strong>Sleep apnoea:</strong> Yes</li>}
            {data.smoker === 'Yes' && <li><strong>Smoker:</strong> Yes</li>}
            {data.otherContext && <li><strong>Other:</strong> {data.otherContext}</li>}
          </ul>
        </div>
      )}

      {!hasAnyResults && (
        <ReportSection title="No Results">
          <p className="text-sm text-muted-foreground">Enter your assessment results in the tabs above then return here to view your report.</p>
        </ReportSection>
      )}

      {/* Blood Pressure */}
      {hasBP && (
        <ReportSection title="YOUR BLOOD PRESSURE RESULTS" tag={calc.bpClass || 'Recorded'} tagColor={getStatusColor(calc.bpClass)}>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Systolic" value={data.bpSystolic} unit="mmHg" sub="Pressure when heart pumps" />
            <MetricCard label="Diastolic" value={data.bpDiastolic} unit="mmHg" sub="Pressure between beats" />
          </div>
          <AdviceBlock items={adviceBloodPressure(data, calc.bpClass)} />
        </ReportSection>
      )}

      {/* BMI */}
      {hasBMI && (
        <ReportSection title="YOUR BODY MASS INDEX AND WEIGHT" tag={calc.bmiClass || 'Calculated'} tagColor={getStatusColor(calc.bmiClass)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Height" value={data.height} unit="cm" />
            <MetricCard label="Weight" value={data.weight} unit="kg" />
            <MetricCard label="BMI" value={calc.bmi} unit="kg/m²" sub="Body Mass Index" />
            <MetricCard label="Category" value={calc.bmiClass || '—'} sub="NHS aligned range" />
          </div>
          <AdviceBlock items={adviceBMI(data, calc.bmiClass)} />
        </ReportSection>
      )}

      {/* Pulse */}
      {hasPulse && (
        <ReportSection title="YOUR HEART RATE AND CARDIOVASCULAR FITNESS" tag={calc.pulseClass || 'Recorded'} tagColor={getStatusColor(calc.pulseClass)}>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Resting pulse" value={data.pulseRate} unit="bpm" />
            <MetricCard label="Category" value={calc.pulseClass || '—'} sub="Interpretation" />
          </div>
          <AdviceBlock items={advicePulse(data, calc.pulseClass)} />
        </ReportSection>
      )}

      {/* Cholesterol */}
      {hasChol && (
        <ReportSection title="YOUR CHOLESTEROL AND LIPID PROFILE" tag="Lipid screening">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Total cholesterol" value={data.totalCholesterol} unit="mmol/L" sub={calc.cholesterol.totalStatus} />
            <MetricCard label="HDL cholesterol" value={data.hdlCholesterol || '—'} unit="mmol/L" sub={calc.cholesterol.hdlStatus} />
            <MetricCard label="LDL cholesterol" value={data.ldlCholesterol || '—'} unit="mmol/L" sub={calc.cholesterol.ldlStatus} />
            <MetricCard label="Triglycerides" value={data.triglycerides || '—'} unit="mmol/L" sub={calc.cholesterol.triglyceridesStatus} />
            <MetricCard label="TC/HDL ratio" value={calc.tcHdlRatio || '—'} sub={calc.cholesterol.riskLevel} />
            <MetricCard label="LDL/HDL ratio" value={calc.ldlHdlRatio || '—'} />
            <MetricCard label="Non HDL cholesterol" value={calc.nonHdlCholesterol || '—'} unit="mmol/L" />
            <MetricCard label="Glucose" value={data.glucose || '—'} unit="mmol/L" sub="Context only" />
          </div>
          <AdviceBlock items={adviceCholesterol(data, calc.cholesterol.overall || '')} />
        </ReportSection>
      )}

      {/* Fatigue */}
      {hasFatigue && (
        <ReportSection title="YOUR FATIGUE AND ENERGY LEVELS" tag={calc.fatigueLevel || 'Recorded'} tagColor={getStatusColor(calc.fatigueLevel)}>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Fatigue score" value={calc.fatigueScore} unit="/ 110" sub="Chalder Fatigue Scale" />
            <MetricCard label="Level" value={calc.fatigueLevel || '—'} sub="Overall impact" />
          </div>
          <AdviceBlock items={adviceFatigue(data, calc.fatigueLevel)} />
        </ReportSection>
      )}

      {/* Wellbeing */}
      {hasWellbeing && (
        <ReportSection title="YOUR OVERALL WELLBEING" tag={calc.wellbeingCategory || 'Assessed'} tagColor={getStatusColor(calc.wellbeingCategory)}>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Average score" value={calc.wellbeingAverage} unit="/ 10" sub="Self rated wellbeing" />
            <MetricCard label="Category" value={calc.wellbeingCategory || '—'} sub="Interpretation" />
          </div>
          {data.wellbeingPriorities && (
            <div className="mt-3 p-3 border border-dashed border-border rounded-xl bg-muted/30">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Key wellbeing priorities noted</div>
              <div className="text-sm font-semibold text-foreground mt-1">{data.wellbeingPriorities}</div>
            </div>
          )}
          <AdviceBlock items={adviceWellbeing(data, calc.wellbeingAverage)} />
        </ReportSection>
      )}

      {/* Urinalysis */}
      {hasUrinalysis && (
        <ReportSection title="YOUR URINALYSIS RESULTS" tag="Urine screening">
          <AdviceBlock items={urinalysisLines} />
        </ReportSection>
      )}

      {/* Personal Health Context */}
      {hasContext && (
        <ReportSection title="YOUR PERSONAL HEALTH CONTEXT">
          <AdviceBlock items={contextLines} />
        </ReportSection>
      )}

      {/* Priority Actions */}
      {hasAnyResults && (
        <ReportSection title="YOUR PRIORITY ACTIONS, NEXT 4 WEEKS" tag="Action plan">
          <AdviceBlock items={advicePriority(data, calc)} />
          <div className="mt-4 p-4 border border-dashed border-border rounded-xl bg-muted/30">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Follow up and support</div>
            <div className="text-sm leading-relaxed text-foreground mt-2">
              If you would like to review your progress, book a follow up with Corezen Health in 4 to 8 weeks. If you develop new or worsening symptoms, please contact your GP or NHS 111 (or 999 in an emergency).
              <br /><strong>Corezen Health:</strong> info@corezenhealth.co.uk
            </div>
          </div>
        </ReportSection>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border no-print" id="reportFooter">
        <p>This report is produced by Corezen Health for education and guidance purposes. It is not a diagnostic document and does not replace medical advice from your GP or specialist.</p>
        <p className="mt-1">© {new Date().getFullYear()} Corezen Health. All rights reserved.</p>
      </div>

      <div className="flex gap-4 justify-start no-print">
        <button onClick={() => onNavigate('essential')} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-bold hover:opacity-90 transition-all">
          ← Back to Assessment
        </button>
      </div>
    </div>
  );
};
