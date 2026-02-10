import type { AssessmentData, CalculatedValues } from '@/types/assessment';

// Clean advice text: remove dashes at start of sentences, remove comma before "and"
export function cleanAdviceText(text: string): string {
  return text
    .replace(/^\s*[-–—]\s*/gm, '')
    .replace(/,\s+and\b/gi, ' and')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const SIGNPOST = {
  bp: '<strong>Helpful resources:</strong> For further information on blood pressure visit bhf.org.uk/informationsupport/risk-factors/high-blood-pressure. The British Heart Foundation provides clear guidance on understanding and managing blood pressure.',
  lowbp: '<strong>Helpful resources:</strong> For further information on low blood pressure visit nhs.uk and search for low blood pressure.',
  cholesterol: '<strong>Helpful resources:</strong> For further information on cholesterol visit bhf.org.uk/informationsupport/risk-factors/high-cholesterol. HEART UK (heartuk.org.uk) also provides specialist cholesterol guidance and support.',
  weight: '<strong>Helpful resources:</strong> For further information on healthy weight visit nhs.uk/better-health/lose-weight. The British Dietetic Association (bda.uk.com) also provides evidence based dietary guidance.',
  mind: '<strong>Helpful resources:</strong> Support for stress, anxiety and low mood is available via Every Mind Matters at nhs.uk/every-mind-matters and via Mind at mind.org.uk. If you are in crisis, contact Samaritans on 116 123 (free and available 24 hours a day, 7 days a week).',
  smoking: '<strong>Helpful resources:</strong> Stop smoking support is available via NHS Smokefree at nhs.uk/better-health/quit-smoking or call the free helpline on 0300 123 1044. Your local pharmacy can also provide free stop smoking support.',
  alcohol: '<strong>Helpful resources:</strong> Alcohol support and safer drinking guidance is available at drinkaware.co.uk. Drinkline is available on 0300 123 1110.',
  sleep: '<strong>Helpful resources:</strong> Sleep guidance is available at sleepfoundation.org and nhs.uk (search sleep tips). The Sleep Charity (thesleepcharity.org.uk) also provides free evidence based sleep advice.',
  fatigue: '<strong>Helpful resources:</strong> For further information on fatigue and energy management visit the ME Association at meassociation.org.uk or Action for ME at actionforme.org.uk. If fatigue is persistent or worsening, speak to your GP.',
  wheelchair: '<strong>Helpful resources:</strong> For wheelchair accessible exercise guidance visit the Activity Alliance at activityalliance.org.uk which provides inclusive activity resources. Wheelchair Sport England (wheelchairsport.co.uk) and the English Federation of Disability Sport also offer adapted activity programmes.',
  diabetes: '<strong>Helpful resources:</strong> Diabetes support and guidance is available at diabetes.org.uk (Diabetes UK). They provide free information on managing blood glucose, diet and living well with diabetes.',
  urinalysis: '<strong>Helpful resources:</strong> For further information about urine test results visit nhs.uk and search for urine tests. Your GP practice can arrange follow up testing if needed.',
};

// Determine if person is a wheelchair user (distinct from other mobility limitations)
function isWheelchairUser(mobility: string): boolean {
  return mobility.toLowerCase().includes('wheelchair');
}

// Determine if person has any mobility limitation
function hasMobilityLimitation(mobility: string): boolean {
  const m = mobility.toLowerCase();
  return m.includes('limited') || m.includes('wheelchair') || m.includes('housebound') || m.includes('walking aid') || m.includes('significant');
}

export function adviceBloodPressure(data: AssessmentData, category: string): string[] {
  const diet = (data.dietPattern || '').toLowerCase();
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';

  const common = [
    '<strong>What this means:</strong> Blood pressure measures the force of blood against your artery walls. The first number (systolic) is the pressure when your heart pumps blood out. The second number (diastolic) is the pressure when your heart rests between beats. Both numbers matter for understanding your cardiovascular health.',
    '<strong>Important note:</strong> Blood pressure can vary throughout the day depending on activity, stress, hydration, posture and time of day. A single reading provides a snapshot and may not reflect your usual level. This is a screening result and not a diagnosis.',
  ];

  const foodLines = buildFoodAdvice(diet);
  const movementLines = buildMovementAdvice(mobility, activityBarrier);

  const smokeLine = data.smoker === 'Yes'
    ? ['<strong>Smoking:</strong> Smoking raises blood pressure and damages your arteries. NHS stop smoking support through your pharmacy or GP significantly improves quit success rates. ' + SIGNPOST.smoking]
    : [];

  const alcoholLines = buildAlcoholAdvice(data.alcohol, data.alcoholUnits);

  // Very high reading - urgent
  if (category.includes('Very high') || category.includes('urgent')) {
    return [
      ...common,
      `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is very high and requires prompt clinical assessment.`,
      '<strong>Action needed:</strong> Contact your GP surgery today for further assessment. If you experience chest pain, severe headache, breathlessness, visual changes, weakness, confusion or feel acutely unwell, call 999 or attend A&E immediately.',
      '<strong>Follow up:</strong> Once you have seen your GP, you are welcome to rebook with Corezen Health for monitoring and ongoing support.',
      ...foodLines, ...movementLines, ...smokeLine, ...alcoholLines, SIGNPOST.bp
    ];
  }

  // High reading - GP review advised
  if (category.includes('High reading')) {
    return [
      ...common,
      `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is in the high range. This is a screening finding and not a diagnosis. Further readings are needed to confirm whether this reflects your usual blood pressure.`,
      '<strong>Action needed:</strong> Book a GP appointment within 1 to 2 weeks. Your GP may arrange home or ambulatory monitoring and discuss your overall cardiovascular risk including cholesterol, diabetes and kidney health.',
      '<strong>Home monitoring:</strong> If you have a home blood pressure monitor, take readings twice daily (morning and evening) for 4 to 7 days. Sit quietly for 5 minutes beforehand with your feet flat on the floor and cuff at heart level. Avoid talking during the reading. Record all readings and bring them to your GP.',
      '<strong>Corezen follow up:</strong> Rebook with Corezen Health in 1 to 2 weeks if you would like support interpreting your home readings or would like a repeat clinic check.',
      ...foodLines, ...movementLines, ...smokeLine, ...alcoholLines, SIGNPOST.bp
    ];
  }

  // Raised reading - GP confirmation needed
  if (category.includes('Raised reading')) {
    return [
      ...common,
      `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is above the recommended range. This is a screening finding and not a diagnosis. Many people can improve readings with consistent lifestyle changes but GP confirmation is still important.`,
      '<strong>Action needed:</strong> Arrange a routine GP appointment to discuss your blood pressure and whether home monitoring or further assessment is needed.',
      '<strong>Home monitoring:</strong> If requested by your GP, take readings twice daily (morning and evening) for 4 to 7 days using proper technique as described above.',
      '<strong>Corezen follow up:</strong> Rebook with Corezen Health in 2 to 4 weeks to review your progress and repeat your screening.',
      ...foodLines, ...movementLines, ...smokeLine, ...alcoholLines, SIGNPOST.bp
    ];
  }

  // Higher end of normal
  if (category.includes('Higher end')) {
    return [
      ...common,
      `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is at the higher end of the normal range. This is an ideal time to focus on preventive lifestyle measures.`,
      '<strong>Action needed:</strong> No urgent GP review is needed. Focus on lifestyle steps such as reducing salt intake, maintaining a healthy weight, regular physical activity and limiting alcohol.',
      '<strong>Corezen follow up:</strong> Rebook with Corezen Health in 6 to 12 months for a routine recheck or sooner if you would like to monitor your progress.',
      ...foodLines, ...movementLines, ...smokeLine, ...alcoholLines, SIGNPOST.bp
    ];
  }

  // Low reading
  if (category.includes('Low')) {
    return [
      ...common,
      `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is lower than typical. This is often normal, especially if you feel well and have no symptoms.`,
      '<strong>Action needed:</strong> If you experience dizziness, fainting, light-headedness or new symptoms, speak to your GP. Stay well hydrated and change position slowly when standing from sitting or lying.',
      '<strong>Hydration:</strong> Aim for pale straw coloured urine throughout the day. If you take blood pressure medications and have symptoms, discuss this with your GP.',
      SIGNPOST.lowbp
    ];
  }

  // Normal / Optimal
  return [
    ...common,
    `<strong>Your result:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is within the healthy range. This supports long term heart and brain health.`,
    '<strong>Maintaining this:</strong> Continue with your current healthy habits. Regular physical activity, a balanced diet, maintaining a healthy weight and limiting alcohol all support cardiovascular health.',
    '<strong>Corezen follow up:</strong> Routine screening every 1 to 2 years is recommended. Rebook with Corezen Health for your next check.',
    ...foodLines, ...movementLines, ...smokeLine, ...alcoholLines, SIGNPOST.bp
  ];
}

export function adviceBMI(data: AssessmentData, category: string): string[] {
  const diet = (data.dietPattern || '').toLowerCase();
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const weight = parseFloat(data.weight || '');

  const common = [
    '<strong>What this means:</strong> BMI (Body Mass Index) is a screening tool that compares your weight to your height. It does not directly measure body fat or muscle composition so it is interpreted alongside your wider health context. Athletes and people with higher muscle mass may have a higher BMI without increased health risk.',
    '<strong>Waist measurement:</strong> Waist circumference can add useful context. A higher waist size is linked to higher cardiometabolic risk even when BMI appears normal.',
  ];

  const nutrition = buildNutritionAdvice(diet);
  const movement = buildMovementAdvice(mobility, activityBarrier);

  if (category === 'Underweight') return [
    ...common,
    '<strong>Your result:</strong> Your BMI is below the usual healthy range. If this is new, unintentional or accompanied by symptoms such as appetite change, bowel changes or fatigue, GP review is recommended.',
    '<strong>Food approach:</strong> Prioritise nutrient dense calories. Add olive oil, nut butters, avocado and full fat yoghurt (if you consume dairy) and include extra snacks between meals. Include protein with every meal to support muscle maintenance.',
    '<strong>Action needed:</strong> Consider arranging a GP review to discuss possible underlying causes and receive tailored support.',
    ...movement, SIGNPOST.weight
  ];

  if (category === 'Obese') {
    const lines = [
      ...common,
      '<strong>Your result:</strong> Your BMI is in a range associated with increased risk of type 2 diabetes, high blood pressure, sleep apnoea and cardiovascular disease. The most effective approach is steady and sustainable change.',
    ];
    if (!isNaN(weight) && weight > 0) {
      const min = Math.max(1, Math.round(weight * 0.05));
      const max = Math.max(2, Math.round(weight * 0.10));
      lines.push(`<strong>Realistic target:</strong> A first target of 5 to 10 percent weight loss (about ${min} to ${max} kg) over the next 3 to 6 months. Even this modest change can improve blood pressure, cholesterol and energy levels.`);
    }
    return [...lines, ...nutrition, ...movement,
      '<strong>Action needed:</strong> If your BMI is significantly elevated or you have related conditions, your GP can discuss structured weight management options and additional support. Rebook with Corezen Health in 4 to 8 weeks to track your progress.',
      SIGNPOST.weight
    ];
  }

  if (category === 'Overweight') {
    const lines = [
      ...common,
      '<strong>Your result:</strong> Your BMI is above the healthy range. Even modest weight loss of 5 to 10 percent can improve blood pressure, cholesterol and energy levels.',
    ];
    if (!isNaN(weight) && weight > 0) {
      lines.push(`<strong>Realistic target:</strong> A practical first target is around ${Math.max(1, Math.round(weight * 0.05))} kg over 10 to 12 weeks using small and repeatable steps.`);
    }
    return [...lines, ...nutrition, ...movement,
      '<strong>Corezen follow up:</strong> Rebook with Corezen Health in 4 to 8 weeks to review your progress.',
      SIGNPOST.weight
    ];
  }

  return [
    ...common,
    '<strong>Your result:</strong> Your BMI is within the healthy range which is associated with the lowest risk of weight related conditions.',
    '<strong>Maintaining this:</strong> Continue with balanced meals, regular movement and a good sleep routine. If you have specific body composition goals, strength training twice weekly can support muscle maintenance.',
    ...nutrition, ...movement, SIGNPOST.weight
  ];
}

export function advicePulse(data: AssessmentData, category: string): string[] {
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const smoker = data.smoker === 'Yes';
  const caffeine = (data.lastCaffeineTime || '').toLowerCase();
  const caffeineIntake = data.fr_caffeineIntake || '';
  const sleep = parseInt(data.fr_sleepQuality || data.sleepQuality || '', 10);
  const stress = parseInt(data.fr_stressLevel || '', 10);
  const alcohol = data.alcohol === 'Yes';

  const personalFactors: string[] = [];

  if (smoker) {
    personalFactors.push('You noted that you smoke. Nicotine increases resting heart rate. Stopping smoking supports a healthier resting pulse and overall cardiovascular health.');
  }
  if (caffeine.includes('after') || caffeine.includes('16:00') || caffeineIntake === '4+') {
    personalFactors.push('You noted higher caffeine intake. Caffeine can temporarily raise your heart rate. Consider reducing caffeine after lunchtime to support a calmer resting pulse.');
  }
  if (!isNaN(sleep) && sleep <= 4) {
    personalFactors.push('You noted poor sleep quality. Poor sleep can elevate resting heart rate. Improving sleep hygiene supports a healthier resting pulse.');
  }
  if (!isNaN(stress) && stress >= 7) {
    personalFactors.push('You noted high stress levels. Chronic stress activates your nervous system and can elevate resting pulse. Regular breathing exercises, physical activity and rest periods support a calmer heart rate.');
  }
  if (alcohol && parseInt(data.alcoholUnits || '0', 10) > 14) {
    personalFactors.push('Your alcohol intake is above recommended levels. Reducing alcohol can help lower resting heart rate and improve cardiovascular health.');
  }

  const personalSection = personalFactors.length > 0
    ? [`<strong>Based on your responses:</strong> ${personalFactors.join(' ')}`]
    : [];

  const movementAdvice = buildPulseMovementAdvice(mobility, activityBarrier);

  if (category.includes('Normal')) {
    return [
      '<strong>What this means:</strong> Your resting pulse is the number of times your heart beats per minute while you are at rest. A normal resting pulse for most adults is between 60 and 100 beats per minute.',
      `<strong>Your result:</strong> Your resting pulse (${data.pulseRate} bpm) is within the normal range. This generally indicates healthy cardiovascular function.`,
      ...personalSection,
      ...movementAdvice,
      '<strong>Healthy habits:</strong> Regular hydration, steady sleep routines and breathing practices all support a stable resting pulse over time.',
    ];
  }

  if (category.includes('Below')) {
    return [
      '<strong>What this means:</strong> Your resting pulse is below the usual adult range of 60 to 100 beats per minute. This can be normal in very fit individuals or during deep relaxation.',
      `<strong>Your result:</strong> Your resting pulse today (${data.pulseRate} bpm) is below the typical range.`,
      '<strong>When to seek advice:</strong> If you experience symptoms such as dizziness, faintness, breathlessness or chest discomfort, please speak to your GP. Certain medications (such as beta blockers), thyroid conditions and electrolyte imbalances can lower pulse rate.',
      ...personalSection,
      '<strong>Healthy habits:</strong> Staying well hydrated, maintaining steady sleep patterns and regular breathing practices all support cardiovascular health.',
    ];
  }

  // Above normal range
  return [
    '<strong>What this means:</strong> Your resting pulse is above the usual adult range of 60 to 100 beats per minute. This can occur with stress, dehydration, pain, fever, caffeine, nicotine and poor sleep.',
    `<strong>Your result:</strong> Your resting pulse today (${data.pulseRate} bpm) is above the typical range.`,
    ...personalSection,
    '<strong>Immediate steps:</strong> Ensure you are well hydrated, reduce caffeine and nicotine intake if applicable and allow time for rest and recovery.',
    '<strong>When to seek advice:</strong> If you experience palpitations, chest pain, breathlessness, faintness or your pulse remains consistently elevated at rest, please speak to your GP.',
    ...movementAdvice,
  ];
}

export function adviceCholesterol(data: AssessmentData, overall: string): string[] {
  const diet = (data.dietPattern || '').toLowerCase();
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';

  const movementLine = buildCholesterolMovementAdvice(mobility, activityBarrier);

  const common = [
    '<strong>Lifestyle factors:</strong> Cholesterol responds to diet pattern, weight, physical activity, smoking, alcohol and genetics. Improvements are often seen over weeks to months with consistent effort.',
    movementLine,
    '<strong>Fibre focus:</strong> Soluble fibre helps lower LDL cholesterol. Good sources include oats, beans, lentils, chickpeas, fruit and vegetables.',
    '<strong>Fat quality:</strong> Replacing saturated fats with unsaturated fats supports cholesterol improvement. Choose olive oil, nuts, seeds, avocado and oily fish (or plant based omega 3 sources if vegan).',
    data.smoker === 'Yes' ? '<strong>Smoking:</strong> Stopping smoking supports cardiovascular risk reduction and improves HDL cholesterol levels. ' + SIGNPOST.smoking : '',
    SIGNPOST.cholesterol,
  ].filter(Boolean);

  if (overall.toLowerCase().includes('within')) return [
    '<strong>What this means:</strong> Cholesterol is a fatty substance in your blood. Your body needs it but too much can build up in your artery walls and increase the risk of heart disease and stroke. Total cholesterol, LDL (often called bad cholesterol), HDL (often called good cholesterol) and triglycerides are all measured to understand your cardiovascular risk.',
    '<strong>Your result:</strong> Your lipid results are within a healthy range. This supports lower cardiovascular risk.',
    '<strong>Maintaining this:</strong> Continue with healthy habits including regular physical activity and a diet pattern rich in fibre and unsaturated fats.',
    ...common
  ];

  if (overall.toLowerCase().includes('borderline')) return [
    '<strong>What this means:</strong> Cholesterol is a fatty substance in your blood. LDL carries cholesterol to your arteries (higher levels are less desirable) while HDL carries it away (higher levels are protective). Your results are in a borderline range which means lifestyle changes can make a meaningful difference.',
    '<strong>Your result:</strong> Your lipid levels are in a borderline range. This is an opportunity to focus on targeted lifestyle improvements.',
    '<strong>Action needed:</strong> Focus on fibre intake, reducing saturated fat, regular physical activity and weight management. Reducing ultra processed foods and sugary drinks supports triglyceride reduction and overall heart health.',
    ...common
  ];

  return [
    '<strong>What this means:</strong> Cholesterol is a fatty substance in your blood. Your results are in a raised range which means your cardiovascular risk may be increased.',
    '<strong>Your result:</strong> Your lipid levels are above the desirable range.',
    '<strong>Action needed:</strong> A GP appointment is recommended to discuss your overall cardiovascular risk, family history and whether medication may be appropriate.',
    '<strong>Lifestyle still matters:</strong> Lifestyle changes can improve results alongside any treatment your GP recommends. Focus on fibre intake, weight management, regular physical activity and reducing saturated fats.',
    '<strong>Wider picture:</strong> Blood pressure, diabetes status, smoking and family history all influence overall cardiovascular risk. Reviewing the full picture with your GP supports the best management plan.',
    ...common
  ];
}

export function adviceFatigue(data: AssessmentData, classification: string): string[] {
  const level = classification.toLowerCase();
  const diet = (data.dietPattern || '').toLowerCase();
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const sleep = parseInt(data.fr_sleepQuality || data.sleepQuality || '', 10);
  const stress = parseInt(data.fr_stressLevel || '', 10);
  const needsSleepSupport = !isNaN(sleep) && sleep <= 4;
  const highStress = !isNaN(stress) && stress >= 7;
  
  const afternoonCrash = (data.fr_afternoonCrash || '').toLowerCase();
  const brainFog = data.fr_brainFog === 'Yes';
  const postExertional = data.fr_symptomsWorseAfterActivity === 'Yes';
  const recoveryTime = data.fr_recoveryTime || '';
  const fatigueDuration = data.fr_durationFatigue || '';
  const fatigueTrend = data.fr_trendFatigue || '';
  const caffeineIntake = data.fr_caffeineIntake || '';
  const waterIntake = (data.fr_waterIntake || data.waterIntake || '').toLowerCase();

  const movementAdvice = buildFatigueMovementAdvice(mobility, activityBarrier, postExertional);
  const foodAdvice = buildFatigueFoodAdvice(diet);

  const base: string[] = [
    '<strong>What this suggests:</strong> Fatigue is often caused by multiple factors including sleep quality, stress load, physical activity levels, hydration, nutrition, pain, workload and recovery time. Your fatigue score is calculated using the validated Chalder Fatigue Scale which is widely used in clinical practice.',
  ];

  const personalised: string[] = [];

  if (postExertional) {
    if (recoveryTime.includes('Over 7 days') || recoveryTime.includes('3-7 days')) {
      personalised.push('<strong>Post-exertional symptoms:</strong> You reported that your symptoms worsen after activity and take several days to recover. This pattern is important to note. Please discuss this with your GP as it may require specific pacing strategies. Avoid pushing through fatigue as this can prolong recovery. Start with very gentle activity (5 minutes or less) and only increase when you consistently recover well the next day.');
    } else {
      personalised.push('<strong>Post-exertional symptoms:</strong> You reported that your symptoms worsen after activity. Pacing is important. Break activities into smaller chunks with planned rest periods. Listen to your body and stop before you feel exhausted rather than after.');
    }
  }

  if (brainFog) {
    personalised.push('<strong>Brain fog:</strong> You reported experiencing brain fog or mental fatigue. This is common with fatigue and often improves with better sleep, hydration and pacing. Keep a simple routine, use lists and reminders and avoid multitasking. If brain fog is significantly affecting your work or daily activities, discuss this with your GP.');
  }

  if (afternoonCrash.includes('severe') || afternoonCrash.includes('moderate')) {
    personalised.push('<strong>Afternoon energy dip:</strong> You reported a significant afternoon energy crash. This is often related to blood sugar patterns, sleep debt or dehydration. Try eating a balanced lunch with protein and fibre, staying hydrated throughout the day and if possible, a brief rest or short walk after lunch. Avoid sugary snacks which can worsen the crash.');
  }

  if (caffeineIntake === '4+') {
    personalised.push('<strong>Caffeine intake:</strong> You noted high caffeine consumption (4 or more drinks per day). While caffeine provides short term alertness, high intake can disrupt sleep quality and create a cycle of fatigue. Consider gradually reducing intake, especially after lunchtime and replacing with water or herbal teas.');
  }

  if (waterIntake.includes('under 1') || waterIntake.includes('less than 1')) {
    personalised.push('<strong>Hydration:</strong> You noted low water intake (under 1 litre per day). Dehydration is a common cause of fatigue. Aim for 1.5 to 2 litres of water or other non-caffeinated fluids daily. Keep a water bottle visible as a reminder.');
  }

  if (fatigueDuration.includes('Over 12 months') || fatigueDuration.includes('6-12 months')) {
    personalised.push('<strong>Duration of fatigue:</strong> You reported fatigue lasting 6 months or longer. Persistent fatigue of this duration warrants GP review to exclude underlying causes and discuss appropriate support. Please arrange an appointment if you have not already.');
  }
  if (fatigueTrend === 'Worse') {
    personalised.push('<strong>Fatigue trend:</strong> You noted your fatigue is getting worse. This is an important signal to seek GP review sooner rather than later. Worsening fatigue can indicate an underlying issue that needs investigation.');
  }

  // Diet quality from fatigue tab
  const dietQual = parseInt(data.dietQuality || '', 10);
  if (!isNaN(dietQual) && dietQual <= 4) {
    personalised.push('<strong>Diet quality:</strong> You rated your diet quality as low. Nutrition is closely linked to energy levels. Focus on including protein and fibre at each meal, eating at regular intervals and reducing ultra processed foods and sugary drinks. Small consistent changes can make a noticeable difference to energy.');
  }

  // Overall health rating
  if (data.overallHealth === 'Poor' || data.overallHealth === 'Very poor') {
    personalised.push('<strong>Overall health:</strong> You rated your overall health as ' + data.overallHealth.toLowerCase() + '. This is worth discussing with your GP to ensure any underlying health concerns are being addressed. A comprehensive health review can help identify areas for improvement.');
  }

  // Alcohol from fatigue tab
  if (data.alcoholIntake === '3 to 4 drinks' || data.alcoholIntake === '5 or more drinks') {
    personalised.push('<strong>Alcohol and fatigue:</strong> Higher alcohol intake can significantly disrupt sleep quality and worsen fatigue. Alcohol reduces time spent in deep restorative sleep even when total sleep time appears adequate. Consider reducing intake and having alcohol free days. ' + SIGNPOST.alcohol);
  }

  base.push(...personalised);
  base.push(movementAdvice);
  base.push(foodAdvice);
  base.push('<strong>Fibre rich options:</strong> Include oats, wholegrain bread, brown rice, quinoa, beans, lentils, chickpeas, berries, apples, pears, vegetables and seeds such as chia or flax most days.');
  base.push('<strong>Caffeine guidance:</strong> Most adults can tolerate up to around 400 mg of caffeine per day (roughly 4 cups of brewed filter coffee or 5 cups of instant coffee or 8 cups of tea). If sleep is affected, reduce intake after lunchtime and switch to decaffeinated or herbal options.');
  base.push('<strong>Breathing reset:</strong> Try a 4, 4, 6 pattern. Breathe in through your nose for 4 seconds, hold for 4 seconds and breathe out slowly for 6 seconds. Repeat for 3 to 5 minutes once or twice daily and before bed if your mind feels busy.');
  base.push('<strong>Pacing technique:</strong> Choose one task you usually push through. Break it into small chunks with a planned pause before you feel exhausted. Work for up to 20 minutes then pause for 2 minutes to stretch, drink water or practise breathing. Increase duration gradually only when you are recovering well the next day.');
  base.push('<strong>Follow up:</strong> Consider booking a Corezen Health follow up in 2 to 4 weeks to review progress and adjust your plan. Seek GP input sooner if you have red flag symptoms such as chest pain, fainting, severe breathlessness, unexplained weight loss, persistent fever or new neurological symptoms.');
  base.push(SIGNPOST.fatigue);

  if (level.includes('minimal')) return [
    '<strong>Your result:</strong> Your fatigue score is within a healthier range today. This suggests your current routines are supporting energy and recovery.',
    '<strong>Maintaining this:</strong> Continue with what is working by staying consistent with sleep timing, hydration and regular movement.',
    ...base
  ];

  if (level.includes('mild')) {
    const add: string[] = [];
    if (needsSleepSupport) add.push('<strong>Sleep focus:</strong> Build a steady routine. Keep a consistent wake time, reduce screens for 60 minutes before bed and keep your bedroom cool and dark. If you wake often, try a short breathing reset rather than checking the time.');
    if (highStress) add.push('<strong>Stress management:</strong> Choose one daily decompression habit such as a short walk, stretching or breathing practice for 5 minutes. Small and consistent actions matter more than occasional large efforts.');
    return [
      '<strong>Your result:</strong> Your score suggests mild fatigue. Many people experience this when sleep and recovery slip, stress rises or activity and hydration reduce.',
      ...add, ...base
    ];
  }

  // Moderate or significant
  const add: string[] = [];
  if (needsSleepSupport) add.push('<strong>Sleep priority:</strong> Your sleep rating suggests recovery may be limited. Focus on routine, wind down time and reducing caffeine after lunchtime. If you experience loud snoring, pauses in breathing or significant daytime sleepiness, discuss this with your GP as it may indicate sleep apnoea.');
  const wake = (data.fr_wakeNight || '').toLowerCase();
  if (wake.includes('3') || wake.includes('4') || wake.includes('5')) {
    add.push('<strong>Night waking:</strong> If you wake several times during the night, keep the room dark, avoid checking your phone and use breathing exercises for a few minutes. If pain, reflux or bladder symptoms are driving waking, note patterns so we can tailor your plan at follow up.');
  }
  return [
    '<strong>Your result:</strong> Your score suggests more significant fatigue. This is a prompt to prioritise recovery and address the biggest drivers first which are typically sleep, stress and sustainable activity.',
    '<strong>GP review:</strong> If fatigue is persistent, worsening or affecting your daily activities significantly, please arrange a GP appointment to discuss possible underlying causes and consider routine blood tests.',
    ...add, ...base
  ];
}

export function adviceWellbeing(data: AssessmentData, avg: string): string[] {
  const score = parseFloat(avg || '0');
  const diet = (data.dietPattern || '').toLowerCase();
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const stress = parseInt(data.fr_stressLevel || '', 10);
  const sleep = parseInt(data.fr_sleepQuality || data.sleepQuality || '', 10);
  const workPattern = data.workPattern || '';

  const mood = (data.wellbeingMood || '').toLowerCase();
  const moodFreq = (data.wellbeingMoodFrequency || '').toLowerCase();
  const relax = (data.wellbeingRelaxation || '').toLowerCase();
  const support = (data.wellbeingSocialSupport || '').toLowerCase();
  const openMind = (data.wellbeingMindfulness || '').toLowerCase();
  const openBreath = (data.wellbeingBreathing || '').toLowerCase();
  const stressors = data.wellbeingStressors || [];

  const foodAdvice = buildWellbeingFoodAdvice(diet);
  const movementAdvice = buildWellbeingMovementAdvice(mobility, activityBarrier);

  const base = [
    '<strong>What this reflects:</strong> Your wellbeing rating gives a snapshot of how you feel across key areas today. Improving wellbeing usually works best when you target one to two small habits at a time rather than trying to change everything at once.',
    foodAdvice,
    '<strong>Fibre rich foods:</strong> Include oats, wholegrain bread, beans, lentils, chickpeas, vegetables, berries, apples, pears and seeds such as chia or flax most days. If you increase fibre, increase your fluid intake too.',
    movementAdvice,
    '<strong>Breathing exercise:</strong> Try box breathing. Breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds and hold for 4 seconds. Repeat for 2 to 4 minutes. If you feel light-headed, stop and return to normal breathing.',
    '<strong>Follow up:</strong> Consider a Corezen Health check in within 4 weeks to review changes and adjust your plan. If mood is persistently low, anxiety is severe or you have thoughts of self harm, seek urgent help via NHS 111, your GP or emergency services.',
    SIGNPOST.mind
  ];

  // Mood personalisation
  const moodLines: string[] = [];
  if (mood) {
    moodLines.push(`<strong>Mood noted:</strong> You indicated your mood is ${data.wellbeingMood}${moodFreq ? ` (${moodFreq})` : ''}. This helps tailor your plan.`);
    if (mood.includes('low') || mood.includes('anx')) {
      moodLines.push('<strong>Support available:</strong> If low mood or anxiety is affecting day to day life most days, consider booking a GP appointment to discuss support options including talking therapies and self help resources. If you ever feel unsafe, seek urgent help via NHS 111 or 999.');
    }
  }

  // Stressors personalisation
  if (stressors.length > 0) {
    const stressorList = stressors.join(', ').toLowerCase();
    if (stressorList.includes('work') || stressorList.includes('workload')) {
      moodLines.push('<strong>Work stress:</strong> You identified work or workload as a stress driver. Consider setting one clear boundary this week such as a defined finish time, a lunch break away from your desk or limiting email checking outside work hours.');
    }
    if (stressorList.includes('caring')) {
      moodLines.push('<strong>Caring responsibilities:</strong> You identified caring responsibilities as a stress driver. Carers often neglect their own needs. Try to build in one small thing for yourself each day, even just 10 minutes. Carers UK (carersuk.org) provides support and information for carers.');
    }
    if (stressorList.includes('finances')) {
      moodLines.push('<strong>Financial stress:</strong> You identified finances as a stress driver. Practical support is available through Citizens Advice (citizensadvice.org.uk) and the Money Helper service (moneyhelper.org.uk). Addressing financial worries can reduce overall stress levels.');
    }
    if (stressorList.includes('health')) {
      moodLines.push('<strong>Health concerns:</strong> You identified health concerns as a stress driver. Addressing health worries with your GP can help reduce anxiety. This screening is a positive step towards understanding your health better.');
    }
    if (stressorList.includes('family') || stressorList.includes('relationship')) {
      moodLines.push('<strong>Family and relationships:</strong> You identified family or relationships as a stress driver. Relate (relate.org.uk) offers counselling and support for relationship and family difficulties.');
    }
  }

  // Work pattern
  if (workPattern.includes('Night') || workPattern.includes('Rotating')) {
    moodLines.push('<strong>Shift work:</strong> You work nights or rotating shifts. This can affect sleep, mood and energy. Try to keep meal times as consistent as possible, use blackout curtains for daytime sleep, avoid heavy meals before bed shifts and limit caffeine in the second half of your shift.');
  }

  if (relax.includes('none')) {
    moodLines.push('<strong>Switch off time:</strong> You reported little switch off time at the moment. A realistic starting point is a protected 10 minutes once daily. Choose one low effort activity that settles your nervous system such as a slow walk, gentle stretching, a warm drink without screens or a brief breathing practice.');
  }

  if (support.includes('limited')) {
    moodLines.push('<strong>Social connection:</strong> You reported limited support or feeling isolated. Building connection can be part of your health plan. Try one check in message to a trusted person each week, consider joining a local group (such as a walking group or hobby group) or use telephone support lines if you prefer anonymous support.');
  }

  if (openMind.includes('yes') || openMind.includes('already')) {
    moodLines.push('<strong>Mindfulness practice:</strong> How to try mindfulness (2 to 3 minutes): Sit comfortably and focus on your breathing. When thoughts pull you away, gently return to the feeling of breathing. If that feels hard, try a senses scan. Notice 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell and 1 you can taste.');
  }

  if (openBreath.includes('yes') || openBreath.includes('already')) {
    moodLines.push('<strong>Breathing technique:</strong> Breathe in through your nose for 4 seconds, pause for 1 second and breathe out slowly for 6 seconds. Repeat for 2 to 3 minutes. Keep your shoulders relaxed and breathe low into the belly rather than the upper chest.');
  }

  if (score >= 7) return [
    '<strong>Your result:</strong> Your overall wellbeing score suggests you are doing fairly well at the moment.',
    '<strong>Maintaining this:</strong> Keep what is working and choose one small upgrade that supports long term health such as a short daily walk, adding more vegetables or maintaining a consistent bedtime.',
    ...moodLines, ...base
  ];

  if (score >= 4) {
    const add: string[] = [];
    if (!isNaN(stress) && stress >= 7) add.push('<strong>Stress focus:</strong> Your stress rating is high. Try a daily breathing reset and one boundary such as a fixed stop time for work messages or a 10 minute walk after lunch.');
    if (!isNaN(sleep) && sleep <= 4) add.push('<strong>Sleep focus:</strong> Your sleep rating is low. Keep a consistent wake time, reduce screens for 60 minutes before bed and keep caffeine earlier in the day.');
    return [
      '<strong>Your result:</strong> Your overall wellbeing score suggests there are a few areas that could be improved with targeted and realistic changes.',
      ...add, ...moodLines, ...base
    ];
  }

  return [
    '<strong>Your result:</strong> Your overall wellbeing score suggests you are struggling at the moment. This is a signal to prioritise support and simplify your plan into very small and achievable steps.',
    '<strong>One anchor habit:</strong> If you feel overwhelmed, choose one daily anchor. A short walk, a regular meal and a consistent wake time are good starting points.',
    ...moodLines, ...base
  ];
}

export function adviceUrinalysis(data: AssessmentData): string[] {
  const hasAny = data.urLeukocytes || data.urNitrites || data.urProtein || data.urBlood || data.urGlucose || data.urKetones || data.urBilirubin || data.urUrobilinogen || data.urpH || data.urSpecificGravity;
  if (!hasAny) return [];

  const lines: string[] = [
    '<strong>What this means:</strong> A urine dipstick test checks for substances in your urine that may indicate underlying health conditions. This is a screening test and not a diagnosis. Abnormal results may need further investigation by your GP.',
  ];

  const results: string[] = [];
  if (data.urLeukocytes && data.urLeukocytes !== 'Negative') {
    results.push(`Leukocytes: ${data.urLeukocytes}`);
  }
  if (data.urNitrites === 'Positive') {
    results.push('Nitrites: Positive');
  }
  if (data.urProtein && data.urProtein !== 'Negative') {
    results.push(`Protein: ${data.urProtein}`);
  }
  if (data.urBlood && data.urBlood !== 'Negative') {
    results.push(`Blood: ${data.urBlood}`);
  }
  if (data.urGlucose && data.urGlucose !== 'Negative') {
    results.push(`Glucose: ${data.urGlucose}`);
  }
  if (data.urKetones && data.urKetones !== 'Negative') {
    results.push(`Ketones: ${data.urKetones}`);
  }
  if (data.urBilirubin && data.urBilirubin !== 'Negative') {
    results.push(`Bilirubin: ${data.urBilirubin}`);
  }
  if (data.urUrobilinogen && data.urUrobilinogen.includes('Raised')) {
    results.push('Urobilinogen: Raised');
  }

  // All normal
  if (results.length === 0) {
    lines.push('<strong>Your results:</strong> All parameters tested are within normal limits. No further action is needed based on these results.');
    if (data.urpH) lines.push(`<strong>pH:</strong> Your urine pH was ${data.urpH}. Normal urine pH ranges from 4.5 to 8.0. This is influenced by diet, hydration and metabolic factors.`);
    if (data.urSpecificGravity) lines.push(`<strong>Specific gravity:</strong> Your specific gravity was ${data.urSpecificGravity}. Normal range is 1.005 to 1.030. This reflects hydration status. A higher value may suggest dehydration.`);
    lines.push('<strong>Hydration:</strong> Aim for pale straw coloured urine throughout the day as a simple guide to adequate hydration.');
    return lines;
  }

  lines.push(`<strong>Findings noted:</strong> ${results.join('. ')}.`);

  // Leukocytes and nitrites together suggest UTI
  if ((data.urLeukocytes && data.urLeukocytes !== 'Negative') && data.urNitrites === 'Positive') {
    lines.push('<strong>Leukocytes and nitrites:</strong> The combination of leukocytes and nitrites in urine can suggest a urinary tract infection (UTI). Common symptoms include burning or stinging when passing urine, needing to pass urine more often, cloudy or strong smelling urine and lower abdominal discomfort. Please see your GP for further assessment and possible urine culture. Drink plenty of water in the meantime.');
  } else if (data.urLeukocytes && data.urLeukocytes !== 'Negative') {
    lines.push('<strong>Leukocytes:</strong> Leukocytes (white blood cells) in urine can indicate infection, inflammation or contamination. If you have urinary symptoms (burning, frequency, urgency), please see your GP. If you have no symptoms, this may be a normal variant but can be rechecked if needed.');
  } else if (data.urNitrites === 'Positive') {
    lines.push('<strong>Nitrites:</strong> Nitrites in urine can suggest the presence of bacteria. If you have urinary symptoms, please see your GP for further assessment. Not all bacteria produce nitrites so a negative result does not rule out infection.');
  }

  if (data.urProtein && data.urProtein !== 'Negative') {
    lines.push('<strong>Protein:</strong> Protein in urine (proteinuria) can be caused by vigorous exercise, fever, dehydration or urinary infection. Persistent proteinuria may indicate kidney disease. If this is a new finding or you have risk factors such as diabetes or high blood pressure, please see your GP for a repeat test and further assessment including kidney function blood tests.');
  }

  if (data.urBlood && data.urBlood !== 'Negative') {
    lines.push('<strong>Blood:</strong> Blood in urine (haematuria) can be caused by infection, kidney stones, vigorous exercise or menstruation. Persistent or unexplained blood in urine requires GP assessment. Please arrange a GP appointment for further investigation including urine culture and possible referral.');
  }

  if (data.urGlucose && data.urGlucose !== 'Negative') {
    lines.push('<strong>Glucose:</strong> Glucose in urine (glycosuria) may suggest raised blood glucose levels. This can occur in diabetes or pre-diabetes. If you have not been tested for diabetes, please arrange a fasting blood glucose or HbA1c test with your GP. If you have known diabetes, this finding may indicate that your blood glucose levels need reviewing with your diabetes team.');
  }

  if (data.urKetones && data.urKetones !== 'Negative') {
    lines.push('<strong>Ketones:</strong> Ketones in urine can be caused by fasting, very low carbohydrate diets, prolonged vomiting or uncontrolled diabetes. If you have diabetes and ketones are present, contact your GP or diabetes team promptly as this may indicate diabetic ketoacidosis which needs urgent assessment. If you do not have diabetes, ketones may reflect dietary pattern or dehydration.');
  }

  if (data.urBilirubin && data.urBilirubin !== 'Negative') {
    lines.push('<strong>Bilirubin:</strong> Bilirubin in urine can indicate liver or gallbladder conditions. If you have symptoms such as yellowing of the skin or eyes, dark urine, pale stools or abdominal pain, please see your GP promptly. If this is an isolated finding without symptoms, GP review is still recommended for further liver function assessment.');
  }

  if (data.urUrobilinogen && data.urUrobilinogen.includes('Raised')) {
    lines.push('<strong>Urobilinogen:</strong> Raised urobilinogen can be associated with liver conditions or increased red blood cell breakdown. Please see your GP for further blood tests to assess liver function.');
  }

  if (data.urpH) lines.push(`<strong>pH:</strong> Your urine pH was ${data.urpH}. Normal range is 4.5 to 8.0. Very alkaline urine (above 8.0) may be seen with urinary infections. Very acidic urine (below 5.0) may be seen with dehydration or high protein diets.`);
  if (data.urSpecificGravity) {
    const sg = parseFloat(data.urSpecificGravity);
    if (sg <= 1.005) {
      lines.push(`<strong>Specific gravity:</strong> Your specific gravity (${data.urSpecificGravity}) is at the lower end, which may suggest dilute urine or high fluid intake. This is usually not a concern.`);
    } else if (sg >= 1.025) {
      lines.push(`<strong>Specific gravity:</strong> Your specific gravity (${data.urSpecificGravity}) is at the higher end, which may suggest concentrated urine or dehydration. Try to increase your fluid intake.`);
    } else {
      lines.push(`<strong>Specific gravity:</strong> Your specific gravity (${data.urSpecificGravity}) is within the normal range (1.005 to 1.030).`);
    }
  }

  if (data.urNotes) {
    lines.push(`<strong>Additional notes:</strong> ${data.urNotes}`);
  }

  lines.push('<strong>Hydration:</strong> Aim for pale straw coloured urine throughout the day as a simple guide to adequate hydration.');
  lines.push(SIGNPOST.urinalysis);

  return lines;
}

export function adviceContext(data: AssessmentData): string[] {
  const lines: string[] = [];
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const wheelchair = isWheelchairUser(mobility);
  const mobilityLimited = hasMobilityLimitation(mobility);

  if (wheelchair) {
    lines.push('<strong>Wheelchair user:</strong> Movement remains beneficial and can be adapted to your situation. Upper body exercises, resistance band work, arm cycling (if available), seated stretching and breathing exercises all support circulation, cardiovascular health and mood. A physiotherapist can help create a safe and personalised exercise plan.');
    lines.push(SIGNPOST.wheelchair);
  } else if (mobilityLimited) {
    lines.push('<strong>Movement with limited mobility:</strong> Physical activity remains beneficial and can be adapted to your needs. Chair based exercises, seated marching, resistance band work, supported standing (if safe) and gentle stretching all support circulation, blood pressure and mood. A GP or physiotherapist can help create a safe plan if you have concerns about pain, breathlessness or balance.');
    lines.push('<strong>Helpful resources:</strong> The Chartered Society of Physiotherapy at csp.org.uk provides guidance on exercises for people with limited mobility. Your GP can also refer you to a physiotherapist for a personalised plan.');
  }

  // Activity barriers
  if (activityBarrier === 'Pain') {
    lines.push('<strong>Pain as a barrier:</strong> Pain limiting movement has been noted. Gentle, paced activity often helps manage pain better than complete rest. Start with very short sessions (5 minutes) and build gradually. A physiotherapist can help create a plan that works with your pain rather than against it.');
  } else if (activityBarrier === 'Breathlessness') {
    lines.push('<strong>Breathlessness as a barrier:</strong> Breathlessness limiting activity has been noted. Paced activity with planned rest breaks can help build tolerance. If breathlessness is new, worsening or occurring at rest, please see your GP. Pulmonary rehabilitation may be available if you have a lung condition.');
  } else if (activityBarrier === 'Fatigue') {
    lines.push('<strong>Fatigue as a barrier:</strong> Fatigue limiting activity has been noted. Pacing is key. Start with very short gentle sessions and only increase when you are recovering well. Pushing through fatigue often makes it worse. See the fatigue advice section for more detail.');
  } else if (activityBarrier === 'Motivation') {
    lines.push('<strong>Motivation as a barrier:</strong> Motivation can be challenging. Try linking activity to something you already do (such as a walk after lunch) or finding an accountability partner. Choose activities you enjoy rather than what you think you should do. Even 5 minutes counts and often leads to more.');
  } else if (activityBarrier === 'Time') {
    lines.push('<strong>Time as a barrier:</strong> Lack of time is a common barrier. Look for opportunities to build movement into your day such as walking meetings, taking stairs, parking further away or short walks after meals. Even 10 minute bouts add up and provide health benefits.');
  }

  const diet = data.dietPattern || '';
  if (diet === 'Vegan') {
    lines.push('<strong>Vegan diet:</strong> Your diet pattern has been included. Protein sources for you include beans, lentils, chickpeas, tofu, tempeh, edamame, seitan and soya products. Omega 3 sources include chia seeds, flaxseed, walnuts and algae based supplements. Consider discussing B12 supplementation with your GP if not already taking one.');
    lines.push('<strong>Helpful resources:</strong> The Vegan Society at vegansociety.com provides evidence based guidance on vegan nutrition including B12, iron and omega 3. The British Dietetic Association at bda.uk.com also provides dietary guidance.');
  } else if (diet === 'Vegetarian') {
    lines.push('<strong>Vegetarian diet:</strong> Your diet pattern has been included. Protein sources include beans, lentils, chickpeas, tofu, eggs and dairy where used. Omega 3 sources include chia seeds, flaxseed and walnuts.');
    lines.push('<strong>Helpful resources:</strong> The British Dietetic Association at bda.uk.com provides evidence based dietary guidance for vegetarian diets.');
  } else if (diet === 'Pescatarian') {
    lines.push('<strong>Pescatarian diet:</strong> Your diet pattern has been included. Oily fish (such as salmon, sardines and mackerel) 1 to 2 times weekly provides omega 3s alongside plant proteins from beans, lentils and chickpeas.');
  } else if (diet === 'Halal' || diet === 'Kosher') {
    lines.push(`<strong>${diet} diet:</strong> Your dietary requirements have been noted. The healthy eating principles in this report can be adapted to ${diet.toLowerCase()} food choices. Focus on lean proteins, plenty of vegetables, wholegrains and healthy fats within your dietary framework.`);
  }

  if (data.diabetesType && data.diabetesType !== 'No diabetes' && data.diabetesType !== 'Not sure') {
    lines.push('<strong>Diabetes:</strong> Your diabetes has been included. Balanced meals with higher fibre carbohydrates, lean protein and healthy fats support steadier blood glucose. Regular meal timing and portion awareness support glucose control. Medication plans remain GP led and should be followed as prescribed.');
    lines.push(SIGNPOST.diabetes);
  }

  if (data.sleepApnoea && data.sleepApnoea !== 'No') {
    lines.push('<strong>Sleep apnoea:</strong> Sleep apnoea has been included. Daytime fatigue and raised blood pressure risk can be associated with untreated or undertreated sleep apnoea. CPAP use, mask comfort and adherence support better sleep quality. GP review supports ongoing management and referral to sleep services where needed.');
  }

  if (data.knownHypertension && data.knownHypertension !== 'No') {
    lines.push('<strong>Known high blood pressure:</strong> Known hypertension has been included. Medication adherence, home monitoring and regular GP review support long term control.');
  }

  if (data.knownHighCholesterol && data.knownHighCholesterol !== 'No') {
    lines.push('<strong>Known high cholesterol:</strong> Known high cholesterol has been included. Treatment plans remain GP led. Lifestyle steps support risk reduction alongside medication where prescribed.');
  }

  if (data.pregnancyStatus && data.pregnancyStatus !== 'Not applicable') {
    lines.push('<strong>Pregnancy or postpartum:</strong> Pregnancy or postpartum status has been included. Blood pressure and symptoms such as headaches, visual changes, swelling or upper abdominal pain need prompt medical review during pregnancy and the postpartum period.');
  }

  if (data.shiftWork && data.shiftWork !== 'No') {
    lines.push('<strong>Shift work:</strong> Shift work has been included. Light exposure, meal timing and a consistent wind down routine support sleep quality around night shifts.');
  }

  if ((data.snoring === 'Yes') || (data.witnessedApnoea === 'Yes') || (!isNaN(parseInt(data.daytimeSleepiness)) && parseInt(data.daytimeSleepiness) >= 6)) {
    lines.push('<strong>Sleep breathing symptoms:</strong> Sleep breathing symptoms have been included. Loud snoring, witnessed pauses and significant daytime sleepiness can be associated with sleep apnoea. GP review supports assessment and referral to a sleep service when needed.');
  }

  if (data.restlessLegs === 'Yes') {
    lines.push('<strong>Restless legs:</strong> Restless legs symptoms have been included. Iron deficiency can contribute. GP review supports assessment, blood tests and management. Gentle stretching and a consistent evening routine can support symptoms.');
  }

  if (data.lastCaffeineTime === 'After 16:00' || data.lastCaffeineTime === '14:00 to 16:00') {
    lines.push('<strong>Caffeine timing:</strong> Your caffeine timing has been included. An earlier caffeine cut off supports sleep onset and sleep depth. Water and non-caffeinated drinks later in the day support hydration without affecting sleep.');
  }

  if (data.falls12m && data.falls12m !== 'No') {
    lines.push('<strong>Falls history:</strong> Falls history has been included. Strength, balance and safe home set up support confidence and reduce risk. GP review supports falls assessment when needed and physiotherapy can support safe exercise planning.');
  }

  const pain = parseInt(data.painLimitingMovement || '', 10);
  if (!isNaN(pain) && pain >= 6) {
    lines.push('<strong>Pain limiting movement:</strong> Pain limiting movement has been included. Pacing, gentle strengthening and gradual progression support movement without flare ups. GP review supports pain management and referral to physiotherapy when appropriate.');
  }

  if (data.foodAccess && data.foodAccess !== 'No concerns') {
    lines.push('<strong>Food access:</strong> Food access and cooking concerns have been included. Low cost options such as tinned beans, lentils, frozen vegetables, oats, eggs and tinned fish support nutrition. Batch cooking and simple meals support consistency. The British Dietetic Association at bda.uk.com provides budget friendly eating guidance.');
  }

  if (data.alcoholUnitsWeek === '15 to 21' || data.alcoholUnitsWeek === '22 or more') {
    lines.push('<strong>Alcohol intake:</strong> Your alcohol intake has been included. Reducing alcohol supports blood pressure, sleep quality, weight and mood. ' + SIGNPOST.alcohol);
  }

  if (data.homeBpMonitor === 'Yes') {
    lines.push('<strong>Home blood pressure monitoring:</strong> Home blood pressure monitoring has been included. A seven day home blood pressure log supports accurate GP review. Readings taken at the same times each day and recorded consistently support trend monitoring.');
  }

  if (data.cvEventHistory && data.cvEventHistory !== 'No known event' && data.cvEventHistory !== 'Not sure') {
    lines.push('<strong>Cardiovascular history:</strong> Cardiovascular history has been included. GP review supports risk management, medication review and ongoing monitoring. Lifestyle changes remain valuable alongside prescribed treatment.');
  }

  if (data.kidneyDisease === 'Yes') {
    lines.push('<strong>Kidney disease:</strong> Kidney disease has been included. Blood pressure targets and medication plans remain GP led. GP review supports monitoring of kidney function and cardiovascular risk.');
  }

  if (data.familyHistoryEarly === 'Yes') {
    lines.push('<strong>Family history:</strong> Family history of early heart disease has been included. Cardiovascular risk assessment through the GP supports longer term prevention and monitoring.');
  }

  if (data.upperLimbFunction === 'Moderate limitation' || data.upperLimbFunction === 'Severe limitation') {
    lines.push('<strong>Upper limb limitations:</strong> Upper limb limitations have been included. Activity can be adapted using lower limb movements, breathing based activity, supported standing where safe and physiotherapy guidance.');
  }

  if (data.otherContext) {
    lines.push(`<strong>Additional context:</strong> ${data.otherContext}. This has been considered when tailoring the advice in this report.`);
  }

  return lines;
}

export function advicePriority(data: AssessmentData, calc: CalculatedValues): string[] {
  const out: string[] = [];
  const bp = calc.bpClass;
  const bmiVal = parseFloat(calc.bmi);
  const weight = parseFloat(data.weight);
  const chol = calc.cholesterol;
  const fatigueLevel = calc.fatigueLevel?.toLowerCase() || '';
  const wbAvg = parseFloat(calc.wellbeingAverage);
  const mobility = data.mobilityLevel || '';
  const activityBarrier = data.activityBarriers || '';
  const diet = (data.dietPattern || '').toLowerCase();
  const wheelchair = isWheelchairUser(mobility);
  const mobilityLimited = hasMobilityLimitation(mobility);
  const postExertional = data.fr_symptomsWorseAfterActivity === 'Yes';

  out.push('<strong>Your 4 week action plan:</strong> This plan is tailored to your results today. It focuses on practical and realistic steps you can repeat consistently.');

  // WEEK 1
  const w1: string[] = [];

  if (bp.includes('Very high') || bp.includes('urgent')) {
    w1.push(`<strong>Blood pressure:</strong> Your reading today (${data.bpSystolic}/${data.bpDiastolic} mmHg) is very high. Contact your GP surgery today for further assessment. If you experience chest pain, severe headache, breathlessness, confusion or visual changes, call 999 or attend A&E.`);
  } else if (bp.includes('High reading')) {
    w1.push('<strong>Blood pressure:</strong> Start home blood pressure checks for 4 to 7 days if you have a monitor. Sit quietly for 5 minutes with feet flat on the floor and cuff at heart level. Take 2 readings (1 minute apart) morning and evening. Book a GP appointment within 1 to 2 weeks and bring your readings.');
    w1.push('<strong>Corezen follow up:</strong> Rebook with Corezen Health in 1 to 2 weeks for a repeat screening if you would like support interpreting your home readings.');
  } else if (bp.includes('Raised reading')) {
    w1.push('<strong>Blood pressure:</strong> Your reading is above the recommended range. Book a routine GP appointment to discuss whether home monitoring is needed. Consider lifestyle changes including reducing salt and increasing physical activity.');
    w1.push('<strong>Corezen follow up:</strong> Rebook with Corezen Health in 2 to 4 weeks for a repeat screening to track your progress.');
  } else if (bp.includes('Higher end')) {
    w1.push('<strong>Blood pressure:</strong> Your blood pressure is at the higher end of normal. This is a good time to start one preventive habit such as reducing salt in meals or adding daily movement.');
  } else if (data.bpSystolic && data.bpDiastolic) {
    w1.push('<strong>Blood pressure:</strong> Your blood pressure is in a healthy range. Continue your current routine and use the plan below to maintain long term heart health.');
  }

  if (!isNaN(bmiVal) && bmiVal >= 25 && !isNaN(weight)) {
    const target = Math.round(weight * 0.05);
    w1.push(`<strong>Weight focus:</strong> Aim for an initial ${target} kg reduction over the next 10 to 12 weeks using steady and sustainable changes. This can improve blood pressure, cholesterol and energy.`);
    if (diet.includes('vegan')) {
      w1.push('<strong>Food choice this week:</strong> Add one fibre rich swap daily such as oats, beans, lentils or chickpeas. Reduce one ultra processed snack or sugary drink. Focus on whole plant foods for sustained energy.');
    } else {
      w1.push('<strong>Food choice this week:</strong> Add one fibre rich swap daily (such as oats, wholegrain bread, beans or lentils) and reduce one ultra processed snack or sugary drink.');
    }
  } else if (!isNaN(bmiVal) && bmiVal < 18.5) {
    w1.push('<strong>Weight focus:</strong> Your BMI is below the typical range. Arrange a GP review and focus on regular meals with protein and healthy fats to support energy and nutrition.');
  }

  if (chol?.overall?.toLowerCase().includes('raised')) {
    if (diet.includes('vegan')) {
      w1.push('<strong>Cholesterol focus:</strong> Prioritise soluble fibre daily (oats, beans, lentils, chickpeas, fruit and vegetables). Include plant based omega 3 sources such as chia seeds, flaxseed and walnuts. Choose whole plant fats like avocado, nuts and olive oil.');
    } else {
      w1.push('<strong>Cholesterol focus:</strong> Prioritise soluble fibre daily (oats, beans, lentils, chickpeas, fruit and vegetables) and swap saturated fats for unsaturated fats (olive oil, nuts, seeds, avocado and oily fish).');
    }
  }

  if (fatigueLevel.includes('moderate') || fatigueLevel.includes('significant') || fatigueLevel.includes('severe')) {
    w1.push(`<strong>Energy focus:</strong> Your fatigue score suggests ${calc.fatigueLevel?.toLowerCase()}. Book a GP appointment to discuss fatigue and consider routine blood tests to rule out common causes such as anaemia and thyroid function.`);
    w1.push('<strong>Sleep focus:</strong> Set a consistent sleep and wake time and reduce caffeine after 2pm.');
  } else if (fatigueLevel.includes('mild')) {
    if (wheelchair) {
      w1.push('<strong>Energy focus:</strong> Start a simple routine with a consistent bedtime, morning daylight exposure and adapted upper body movement to support sleep and energy.');
    } else if (mobilityLimited) {
      w1.push('<strong>Energy focus:</strong> Start a simple routine with a consistent bedtime, morning daylight exposure and gentle chair based activity to support sleep and energy.');
    } else {
      w1.push('<strong>Energy focus:</strong> Start a simple routine with a consistent bedtime, morning daylight exposure and a short daily walk to support sleep and energy.');
    }
  }

  if (w1.length) out.push(`<strong>Week 1 (Days 1 to 7):</strong> ${w1.join(' ')}`);

  // WEEK 2
  const w2: string[] = [];
  if (bp.includes('High reading') || bp.includes('Raised reading')) {
    w2.push('<strong>Blood pressure:</strong> Continue home blood pressure checks if using a monitor. If your average remains raised, keep your GP appointment and take your readings with you.');
  }

  if (wheelchair) {
    w2.push('<strong>Movement:</strong> Build your adapted activity sessions this week. Aim for 3 sessions of 15 to 20 minutes of upper body exercises, resistance band work or seated stretching. A physiotherapist can help create a safe and effective plan for you.');
  } else if (mobilityLimited) {
    w2.push('<strong>Movement:</strong> Build your chair based or supported activity sessions this week. Aim for 3 sessions of 15 to 20 minutes of chair exercises, resistance band work or seated stretching.');
  } else if (postExertional) {
    w2.push('<strong>Movement:</strong> Given your post-exertional symptoms, focus on very gentle paced activity. Aim for 3 sessions of 5 to 10 minutes maximum with full recovery between sessions. Only increase if you are recovering well the next day.');
  } else if (!isNaN(bmiVal) && bmiVal >= 25) {
    w2.push('<strong>Movement:</strong> Build towards 150 minutes per week of moderate activity over time. This week aim for 3 sessions of 20 minutes brisk walking or equivalent.');
  } else {
    w2.push('<strong>Movement:</strong> Aim for 10 to 20 minutes of walking or gentle activity on most days to support heart health and mood.');
  }
  if (w2.length) out.push(`<strong>Week 2 (Days 8 to 14):</strong> ${w2.join(' ')}`);

  // WEEK 3
  const w3: string[] = ['<strong>Consolidate:</strong> Refine your routine. Choose the one change that felt easiest and repeat it daily.'];
  if (fatigueLevel) {
    w3.push('<strong>Energy:</strong> Add one recovery habit such as 10 minutes of wind down time before bed with no screens or a short daytime break for breathing and relaxation.');
  }
  if (!isNaN(wbAvg) && wbAvg < 6) {
    w3.push('<strong>Wellbeing:</strong> Review the areas you scored lowest and pick one small and measurable step to improve it this week.');
  }
  out.push(`<strong>Week 3 (Days 15 to 21):</strong> ${w3.join(' ')}`);

  // WEEK 4
  const w4: string[] = ['<strong>Review:</strong> Look back at your week to week progress and note what helped most (food, movement, sleep or stress management).'];
  if (bp.includes('High') || bp.includes('Raised')) {
    w4.push('<strong>Blood pressure:</strong> Bring your home blood pressure averages to your GP if requested and discuss whether ongoing monitoring or treatment is needed.');
  }
  w4.push('<strong>Corezen follow up:</strong> Rebook with Corezen Health for a follow up screening to recheck blood pressure, weight and BMI and (if applicable) cholesterol, fatigue scores and wellbeing. We will adjust your plan based on your progress.');
  out.push(`<strong>Week 4 (Days 22 to 28):</strong> ${w4.join(' ')}`);

  // Helpful resources
  const resourceLines: string[] = [
    '<strong>Helpful resources:</strong>',
  ];
  if (data.smoker === 'Yes') resourceLines.push('Stop smoking support is available via NHS Smokefree at nhs.uk/better-health/quit-smoking or by calling 0300 123 1044. Your local pharmacy can also provide free support.');
  if (data.alcohol === 'Yes') resourceLines.push('Alcohol guidance and support is available at drinkaware.co.uk. Drinkline is available on 0300 123 1110.');
  resourceLines.push('British Heart Foundation at bhf.org.uk provides heart health information and support.');
  resourceLines.push('Every Mind Matters at nhs.uk/every-mind-matters provides free self care resources for stress, sleep, mood and anxiety.');
  resourceLines.push('If symptoms worsen or you feel unwell, contact your GP or call NHS 111.');
  out.push(resourceLines.join(' '));

  return out;
}

// ============== Helper functions ==============

function buildFoodAdvice(diet: string): string[] {
  const lines = [
    '<strong>Food choices:</strong> Aim for a pattern that is high in vegetables, fruit, wholegrains and fibre with mostly unsaturated fats (olive or rapeseed oil, nuts and seeds) and minimal ultra processed foods.',
    '<strong>Salt:</strong> Aim for no more than 6g salt a day (about 1 teaspoon). Choose reduced salt versions, limit takeaway and processed meats and flavour with herbs, garlic, lemon, pepper and spices.',
    '<strong>Potassium rich foods:</strong> These support healthy blood pressure (unless your GP has advised restriction). Include bananas, oranges, tomatoes, spinach, broccoli, beans, lentils and potatoes with skin.',
  ];

  if (diet.includes('vegan')) {
    lines.push('<strong>Vegan protein:</strong> Prioritise beans, lentils, chickpeas, tofu, tempeh, edamame and soya yoghurt for protein. Choose fortified plant milks. Add omega 3 sources such as chia, flaxseed, walnuts and consider algae based supplements.');
  } else if (diet.includes('vegetarian')) {
    lines.push('<strong>Vegetarian protein:</strong> Include beans, lentils, eggs and dairy (if used). Choose lower salt cheeses. Add omega 3 sources such as chia, flaxseed and walnuts.');
  } else if (diet.includes('pesc')) {
    lines.push('<strong>Pescatarian protein:</strong> Include oily fish (such as salmon, sardines and mackerel) 1 to 2 times weekly for omega 3s alongside beans, lentils and plenty of vegetables.');
  } else if (diet.includes('halal') || diet.includes('kosher')) {
    lines.push('<strong>Protein choices:</strong> Choose lean proteins within your dietary requirements. Include plenty of vegetables, wholegrains and healthy fats from olive oil, nuts and seeds.');
  } else {
    lines.push('<strong>Protein choices:</strong> Choose lean proteins (fish, poultry and pulses) and limit processed meats which are often high in salt and saturated fat.');
  }
  return lines;
}

function buildNutritionAdvice(diet: string): string[] {
  const lines = [
    '<strong>Food choices:</strong> Build meals around vegetables, fruit and fibre (wholegrains, oats, beans and lentils). Choose mostly unsaturated fats (olive or rapeseed oil, nuts and seeds) and keep sugary drinks and takeaways as occasional.',
    '<strong>Portion guidance:</strong> Aim for half a plate of vegetables or salad, a quarter lean protein and a quarter wholegrain carbohydrate. If snacking, plan protein plus fibre (such as hummus with vegetables, nuts with fruit or yoghurt with berries).',
  ];
  if (diet.includes('vegan')) {
    lines.push('<strong>Vegan protein:</strong> Use beans, lentils, chickpeas, tofu, tempeh and edamame for protein. Choose fortified plant milks. Include omega 3 sources (chia, flaxseed, walnuts and consider algae supplements).');
  } else if (diet.includes('vegetarian')) {
    lines.push('<strong>Vegetarian protein:</strong> Include beans and lentils plus eggs and dairy (if used). Watch salt in cheeses and choose lower fat options where helpful.');
  } else if (diet.includes('pesc')) {
    lines.push('<strong>Pescatarian protein:</strong> Include oily fish 1 to 2 times weekly plus beans, lentils and vegetables for fibre.');
  }
  return lines;
}

function buildMovementAdvice(mobility: string, activityBarrier: string): string[] {
  if (isWheelchairUser(mobility)) {
    return ['<strong>Movement for wheelchair users:</strong> Regular movement remains beneficial. Focus on upper body exercises such as arm raises, shoulder rolls, resistance band work and arm cycling if available. Breathing exercises and gentle stretching also support circulation and wellbeing. A physiotherapist can help create a personalised plan. Start with 5 to 10 minutes and build gradually.'];
  }
  if (hasMobilityLimitation(mobility)) {
    return ['<strong>Movement with limited mobility:</strong> Short movement sessions still help. Consider chair based exercises such as seated marching, leg lifts, arm exercises, resistance band work or gentle stretching. Start with 5 to 10 minutes and build gradually. A GP or physiotherapist can help create a safe plan if you have concerns about pain, breathlessness or balance.'];
  }
  
  if (activityBarrier === 'Pain') {
    return ['<strong>Movement:</strong> Given pain is a barrier, focus on gentle paced activity. Start with 5 to 10 minutes of low impact movement such as walking or swimming. Pacing is key. A physiotherapist can help create a plan that works with your pain. Aim to build gradually towards 150 minutes per week over time.'];
  }
  if (activityBarrier === 'Breathlessness') {
    return ['<strong>Movement:</strong> Given breathlessness is a barrier, start with short sessions with planned rest breaks. Interval style activity (move for 1 to 2 minutes, rest, repeat) can help build tolerance. If breathlessness is new or worsening, see your GP first. Aim to build gradually towards regular activity.'];
  }
  
  return ['<strong>Movement:</strong> Aim for around 150 minutes per week of moderate activity (such as 25 to 30 minutes on 5 days or about 20 to 25 minutes per day of brisk walking where you can talk but not sing) plus 2 days per week of strength work. Even 10 minute walks after meals can help blood pressure.'];
}

function buildPulseMovementAdvice(mobility: string, activityBarrier: string): string[] {
  if (isWheelchairUser(mobility)) {
    return ['<strong>Adapted activity:</strong> Upper body exercises, resistance band work and breathing exercises support cardiovascular health and can help maintain a healthy resting pulse over time.'];
  }
  if (hasMobilityLimitation(mobility)) {
    return ['<strong>Adapted activity:</strong> Chair based exercises, gentle stretching and breathing exercises support cardiovascular health and can help maintain a healthy resting pulse over time.'];
  }
  return ['<strong>Regular activity:</strong> Regular physical activity and cardiovascular fitness support a healthy resting pulse. Even moderate walking helps improve heart efficiency.'];
}

function buildCholesterolMovementAdvice(mobility: string, activityBarrier: string): string {
  if (isWheelchairUser(mobility)) {
    return '<strong>Physical activity:</strong> Adapted activity such as upper body exercises, resistance band work and arm cycling (if available) supports triglyceride reduction and HDL improvement.';
  }
  if (hasMobilityLimitation(mobility)) {
    return '<strong>Physical activity:</strong> Adapted activity such as chair based exercises, resistance band work and gentle stretching supports triglyceride reduction and HDL improvement.';
  }
  return '<strong>Physical activity:</strong> Regular physical activity supports triglyceride reduction and HDL improvement. Aim for a mix of cardiovascular activity and strength work.';
}

function buildFatigueMovementAdvice(mobility: string, activityBarrier: string, postExertional: boolean): string {
  if (isWheelchairUser(mobility)) {
    return '<strong>Movement:</strong> Adapted physical activity supports energy levels. Focus on upper body exercises, resistance band work, arm cycling if available and breathing exercises. Start with 5 to 10 minutes and build gradually as tolerated.';
  }
  if (hasMobilityLimitation(mobility)) {
    return '<strong>Movement:</strong> Aim for regular adapted activity such as chair based exercises, gentle stretching, resistance band work or supported standing. Start with 5 to 10 minutes and build gradually as tolerated.';
  }
  if (postExertional) {
    return '<strong>Movement:</strong> Given your post-exertional symptoms, pacing is essential. Start with very short gentle sessions (5 minutes or less). Only increase when you are consistently recovering well the next day. Pushing through can worsen fatigue. Prioritise rest and recovery.';
  }
  if (activityBarrier === 'Fatigue') {
    return '<strong>Movement:</strong> Start with very gentle activity (5 to 10 minutes). Pacing is key. Build gradually only when you are recovering well the next day. Pushing through fatigue often makes it worse.';
  }
  return '<strong>Movement:</strong> Aim for around 150 minutes per week of moderate activity. This can be 20 to 25 minutes most days or 30 minutes on 5 days. If energy is low, start with 5 to 10 minutes daily and build gradually.';
}

function buildFatigueFoodAdvice(diet: string): string {
  if (diet.includes('vegan')) {
    return '<strong>Food choices:</strong> Aim for steadier energy by including protein and fibre at meals. Good vegan options include tofu, tempeh, beans, lentils, chickpeas, edamame, nuts and seeds plus vegetables, fruit and wholegrains. Include fortified foods or supplements for B12 and consider omega 3 from chia, flaxseed or algae supplements.';
  }
  if (diet.includes('vegetarian')) {
    return '<strong>Food choices:</strong> Aim for steadier energy by including protein and fibre at meals. Good options include eggs, yoghurt, beans, lentils, chickpeas, tofu and nuts plus vegetables, fruit and wholegrains.';
  }
  if (diet.includes('pesc')) {
    return '<strong>Food choices:</strong> Aim for steadier energy by including protein and fibre at meals. Good options include fish, eggs, yoghurt, beans, lentils, chickpeas, tofu and nuts plus vegetables, fruit and wholegrains.';
  }
  return '<strong>Food choices:</strong> Aim for steadier energy by including protein and fibre at meals. Good options include eggs, yoghurt, fish, chicken, tofu, beans, lentils, chickpeas and nuts plus vegetables, fruit and wholegrains.';
}

function buildWellbeingFoodAdvice(diet: string): string {
  if (diet.includes('vegan')) {
    return '<strong>Food choices:</strong> Aim for regular meals that include plant protein (beans, lentils, chickpeas, tofu, tempeh), fibre and colourful vegetables. This supports energy, gut health and steadier blood sugar. Include fortified foods or B12 supplements.';
  }
  if (diet.includes('vegetarian')) {
    return '<strong>Food choices:</strong> Aim for regular meals that include protein (beans, lentils, eggs, dairy if used), fibre and colourful vegetables. This supports energy, gut health and steadier blood sugar.';
  }
  if (diet.includes('pesc')) {
    return '<strong>Food choices:</strong> Aim for regular meals that include protein (fish, beans, lentils, eggs), fibre and colourful vegetables. This supports energy, gut health and steadier blood sugar.';
  }
  return '<strong>Food choices:</strong> Aim for regular meals that include protein, fibre and colourful vegetables. This supports energy, gut health and steadier blood sugar.';
}

function buildWellbeingMovementAdvice(mobility: string, activityBarrier: string): string {
  if (isWheelchairUser(mobility)) {
    return '<strong>Movement:</strong> Adapted physical activity supports wellbeing. Focus on upper body exercises, resistance band work, breathing exercises and activities you enjoy. Even 10 to 15 minutes of movement can support mood and energy.';
  }
  if (hasMobilityLimitation(mobility)) {
    return '<strong>Movement:</strong> Adapted physical activity supports wellbeing. Chair based exercises, gentle stretching, resistance band work or supported standing all count. Start small with 5 to 10 minutes and build gradually.';
  }
  if (activityBarrier === 'Motivation') {
    return '<strong>Movement:</strong> Finding motivation can be challenging. Try linking activity to something you already do, finding an accountability partner or choosing activities you enjoy. Even 5 minutes counts. Aim to build towards 150 minutes per week of moderate activity over time.';
  }
  return '<strong>Movement:</strong> Aim for around 150 minutes per week of moderate activity. This can be 20 to 25 minutes most days or 30 minutes on 5 days. If you are starting from low activity, begin with 5 to 10 minutes daily and build gradually.';
}

function buildAlcoholAdvice(alcohol: string, units: string): string[] {
  if (alcohol !== 'Yes') return [];
  const u = parseInt(units, 10);
  if (!isNaN(u) && u > 14) {
    return [`<strong>Alcohol:</strong> Your recorded intake (${u} units per week) is above UK guidance (14 units per week). Reducing often improves blood pressure and sleep. Consider alcohol free days and smaller measures. ${SIGNPOST.alcohol}`];
  }
  return ['<strong>Alcohol:</strong> UK guidance is not to regularly exceed 14 units per week, spread over 3 or more days with alcohol free days each week.'];
}
