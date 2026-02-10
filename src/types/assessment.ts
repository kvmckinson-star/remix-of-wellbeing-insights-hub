export interface AssessmentData {
  // Client info
  clientId: string;
  assessmentDate: string;
  clientName: string;
  dateOfBirth: string;
  age: string;
  contactNumber: string;
  email: string;
  gpPractice: string;

  // Vitals
  bpSystolic: string;
  bpDiastolic: string;
  pulseRate: string;
  height: string;
  weight: string;
  bmi: string;

  // Lifestyle
  smoker: string;
  familyHistory: string;
  diabetes: string;
  bpMedication: string;
  exercise: string;
  exerciseFrequency: string;
  alcohol: string;
  alcoholUnits: string;

  // Clinical context
  mobilityLevel: string;
  activityBarriers: string;
  dietPattern: string;
  diabetesType: string;
  knownHypertension: string;
  knownHighCholesterol: string;
  sleepApnoea: string;
  pregnancyStatus: string;
  shiftWork: string;
  nightsPerMonth: string;
  snoring: string;
  witnessedApnoea: string;
  daytimeSleepiness: string;
  restlessLegs: string;
  lastCaffeineTime: string;
  homeBpMonitor: string;
  cvEventHistory: string;
  kidneyDisease: string;
  familyHistoryEarly: string;
  alcoholUnitsWeek: string;
  foodAccess: string;
  falls12m: string;
  painLimitingMovement: string;
  upperLimbFunction: string;
  otherContext: string;

  // Wellbeing
  wbEnergy: string;
  wbSleep: string;
  wbMood: string;
  wbActivity: string;
  wbNutrition: string;
  wbSocial: string;
  wbStress: string;
  wbWorkLife: string;
  wbPurpose: string;
  wbLifeSatisfaction: string;
  wellbeingPriorities: string;
  wellbeingMood: string;
  wellbeingMoodFrequency: string;
  wellbeingStressors: string[];
  wellbeingRelaxation: string;
  wellbeingSocialSupport: string;
  wellbeingMindfulness: string;
  wellbeingBreathing: string;
  workPattern: string;

  // Lipids (Complete Wellbeing only)
  totalCholesterol: string;
  ldlCholesterol: string;
  hdlCholesterol: string;
  triglycerides: string;
  glucose: string;
  lipidsFasting: boolean;
  lipidsOnStatin: boolean;

  // Fatigue - Chalder scale
  chalder: Record<string, string>;

  // Fatigue screening
  fr_sleepHours: string;
  fr_sleepQuality: string;
  fr_diffFallingAsleep: string;
  fr_wakeNight: string;
  fr_refreshedWaking: string;
  fr_caffeineIntake: string;
  fr_waterIntake: string;
  fr_stressLevel: string;
  fr_prioritiesActions: string;
  fr_afternoonCrash: string;
  fr_urgeNap: string;
  fr_brainFog: string;
  fr_needCaffeine: string;
  fr_concentrationDay: string;
  fr_motivationTasks: string;
  fr_muscleAches: string;
  fr_jointPain: string;
  fr_symptomsWorseAfterActivity: string;
  fr_recoveryTime: string;
  fr_activityCrashes: string;
  fr_durationFatigue: string;
  fr_trendFatigue: string;
  fr_worseFatigue: string;
  fr_betterFatigue: string;

  // Sleep & lifestyle (fatigue tab)
  sleepHours: string;
  sleepQuality: string;
  alcoholIntake: string;
  waterIntake: string;
  dietQuality: string;
  overallHealth: string;

  // Urinalysis
  urLeukocytes: string;
  urNitrites: string;
  urProtein: string;
  urBlood: string;
  urGlucose: string;
  urKetones: string;
  urBilirubin: string;
  urUrobilinogen: string;
  urpH: string;
  urSpecificGravity: string;
  urNotes: string;

  // Consent
  consentGiven: boolean;
  consentTimestamp: string;
}

export interface CalculatedValues {
  age: string;
  bmi: string;
  bmiClass: string;
  bpClass: string;
  pulseClass: string;
  cholesterol: CholesterolResults;
  fatigueScore: string;
  fatigueLevel: string;
  wellbeingAverage: string;
  wellbeingCategory: string;
  tcHdlRatio: string;
  ldlHdlRatio: string;
  nonHdlCholesterol: string;
}

export interface CholesterolResults {
  totalStatus?: string;
  hdlStatus?: string;
  ldlStatus?: string;
  triglyceridesStatus?: string;
  ratio?: number;
  nonHdl?: number;
  riskLevel?: string;
  overall?: string;
  ldlHdlRatio?: number;
}

export interface TrackerEntry {
  id: string;
  date: string;
  clientName: string;
  dob: string;
  age: string;
  contact: string;
  email: string;
  service: string;
  price: number;
  status: string;
}

export const INITIAL_DATA: AssessmentData = {
  clientId: '',
  assessmentDate: new Date().toISOString().split('T')[0],
  clientName: '',
  dateOfBirth: '',
  age: '',
  contactNumber: '',
  email: '',
  gpPractice: '',
  bpSystolic: '',
  bpDiastolic: '',
  pulseRate: '',
  height: '',
  weight: '',
  bmi: '',
  smoker: '',
  familyHistory: '',
  diabetes: '',
  bpMedication: '',
  exercise: '',
  exerciseFrequency: '',
  alcohol: '',
  alcoholUnits: '',
  mobilityLevel: '',
  activityBarriers: '',
  dietPattern: '',
  diabetesType: '',
  knownHypertension: '',
  knownHighCholesterol: '',
  sleepApnoea: '',
  pregnancyStatus: '',
  shiftWork: '',
  nightsPerMonth: '',
  snoring: '',
  witnessedApnoea: '',
  daytimeSleepiness: '',
  restlessLegs: '',
  lastCaffeineTime: '',
  homeBpMonitor: '',
  cvEventHistory: '',
  kidneyDisease: '',
  familyHistoryEarly: '',
  alcoholUnitsWeek: '',
  foodAccess: '',
  falls12m: '',
  painLimitingMovement: '',
  upperLimbFunction: '',
  otherContext: '',
  wbEnergy: '',
  wbSleep: '',
  wbMood: '',
  wbActivity: '',
  wbNutrition: '',
  wbSocial: '',
  wbStress: '',
  wbWorkLife: '',
  wbPurpose: '',
  wbLifeSatisfaction: '',
  wellbeingPriorities: '',
  wellbeingMood: '',
  wellbeingMoodFrequency: '',
  wellbeingStressors: [],
  wellbeingRelaxation: '',
  wellbeingSocialSupport: '',
  wellbeingMindfulness: '',
  wellbeingBreathing: '',
  workPattern: '',
  totalCholesterol: '',
  ldlCholesterol: '',
  hdlCholesterol: '',
  triglycerides: '',
  glucose: '',
  lipidsFasting: false,
  lipidsOnStatin: false,
  chalder: {},
  fr_sleepHours: '',
  fr_sleepQuality: '',
  fr_diffFallingAsleep: '',
  fr_wakeNight: '',
  fr_refreshedWaking: '',
  fr_caffeineIntake: '',
  fr_waterIntake: '',
  fr_stressLevel: '',
  fr_prioritiesActions: '',
  fr_afternoonCrash: '',
  fr_urgeNap: '',
  fr_brainFog: '',
  fr_needCaffeine: '',
  fr_concentrationDay: '',
  fr_motivationTasks: '',
  fr_muscleAches: '',
  fr_jointPain: '',
  fr_symptomsWorseAfterActivity: '',
  fr_recoveryTime: '',
  fr_activityCrashes: '',
  fr_durationFatigue: '',
  fr_trendFatigue: '',
  fr_worseFatigue: '',
  fr_betterFatigue: '',
  sleepHours: '',
  sleepQuality: '',
  alcoholIntake: '',
  waterIntake: '',
  dietQuality: '',
  overallHealth: '',
  urLeukocytes: '',
  urNitrites: '',
  urProtein: '',
  urBlood: '',
  urGlucose: '',
  urKetones: '',
  urBilirubin: '',
  urUrobilinogen: '',
  urpH: '',
  urSpecificGravity: '',
  urNotes: '',
  consentGiven: false,
  consentTimestamp: '',
};
