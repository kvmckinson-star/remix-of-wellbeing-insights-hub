import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { AssessmentData, CalculatedValues } from '@/types/assessment';
import { INITIAL_DATA } from '@/types/assessment';
import { calculateAge, calculateBMI, classifyBMI, classifyBloodPressure, classifyPulse, assessCholesterol, calculateChalderTotal, classifyFatigue, calculateWellbeingAverage, classifyWellbeing } from '@/utils/calculations';
import { EssentialHealthTab } from '@/components/assessment/EssentialHealthTab';
import { WellbeingTab } from '@/components/assessment/WellbeingTab';
import { FatigueTab } from '@/components/assessment/FatigueTab';
import { ReportTab } from '@/components/assessment/ReportTab';
import corezenLogo from '@/assets/corezen-logo.png';

const TABS = [
  { id: 'essential', label: 'Essential Health MOT' },
  { id: 'wellbeing', label: 'Complete Wellbeing' },
  { id: 'fatigue', label: 'Fatigue Review' },
  { id: 'report', label: 'Report' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('essential');
  const [data, setData] = useState<AssessmentData>(() => {
    const initial = { ...INITIAL_DATA };
    initial.assessmentDate = new Date().toISOString().split('T')[0];
    // Generate a simple client ID
    const counter = parseInt(localStorage.getItem('corezenClientCounter') || '0', 10) + 1;
    localStorage.setItem('corezenClientCounter', String(counter));
    initial.clientId = String(counter).padStart(4, '0');
    return initial;
  });

  const onChange = useCallback((field: keyof AssessmentData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Computed values
  const calc: CalculatedValues = useMemo(() => {
    const age = calculateAge(data.dateOfBirth);
    const bmi = calculateBMI(parseFloat(data.height || ''), parseFloat(data.weight || ''));
    const bmiClass = classifyBMI(bmi);
    const bpClass = classifyBloodPressure(data.bpSystolic, data.bpDiastolic);
    const pulseClass = classifyPulse(data.pulseRate);
    const cholesterol = assessCholesterol(data.totalCholesterol, data.ldlCholesterol, data.hdlCholesterol, data.triglycerides);
    const fatigueScore = calculateChalderTotal(data.chalder);
    const fatigueLevel = classifyFatigue(fatigueScore);
    const wellbeingAverage = calculateWellbeingAverage(data as any);
    const wellbeingCategory = classifyWellbeing(wellbeingAverage);

    return {
      age,
      bmi,
      bmiClass,
      bpClass,
      pulseClass,
      cholesterol,
      fatigueScore,
      fatigueLevel,
      wellbeingAverage,
      wellbeingCategory,
      tcHdlRatio: cholesterol.ratio ? String(cholesterol.ratio) : '',
      ldlHdlRatio: cholesterol.ldlHdlRatio ? String(cholesterol.ldlHdlRatio) : '',
      nonHdlCholesterol: cholesterol.nonHdl ? String(cholesterol.nonHdl) : '',
    };
  }, [data]);

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearForNext = useCallback(() => {
    if (!confirm('This will clear all patient data from the assessment forms. Continue?')) return;
    const counter = parseInt(localStorage.getItem('corezenClientCounter') || '0', 10) + 1;
    localStorage.setItem('corezenClientCounter', String(counter));
    setData({
      ...INITIAL_DATA,
      assessmentDate: new Date().toISOString().split('T')[0],
      clientId: String(counter).padStart(4, '0'),
    });
    setActiveTab('essential');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="corezen-header-gradient text-primary-foreground text-center py-6 no-print">
        <img src={corezenLogo} alt="Corezen Health" className="h-16 w-16 mx-auto mb-2 rounded-full object-cover bg-primary-foreground p-1" />
        <h1 className="text-2xl font-bold tracking-wider">COREZEN HEALTH</h1>
        <p className="text-secondary text-sm mt-1">Clinical Health Assessment System</p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 mt-6 no-print">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNavigate(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleClearForNext}
            className="ml-auto px-4 py-2 rounded-lg font-semibold text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-all"
          >
            Clear / Next Patient
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {activeTab === 'essential' && (
          <EssentialHealthTab
            data={data}
            onChange={onChange}
            onNavigate={handleNavigate}
            calculatedAge={calc.age}
            calculatedBmi={calc.bmi}
          />
        )}
        {activeTab === 'wellbeing' && (
          <WellbeingTab data={data} onChange={onChange} onNavigate={handleNavigate} />
        )}
        {activeTab === 'fatigue' && (
          <FatigueTab data={data} calc={calc} onChange={onChange} onNavigate={handleNavigate} />
        )}
        {activeTab === 'report' && (
          <ReportTab data={data} calc={calc} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
};

export default Index;
