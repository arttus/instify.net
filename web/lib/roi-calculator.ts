export interface ROIInputs {
  firmSize: string;
  avgCaseValue: number;
  missedCallsPerWeek: number;
  afterHoursCalls: number;
  receptionistSalary: number;
  overtimeCosts: number;
}

export interface ROIResults {
  currentLoss: number;
  potentialRevenue: number;
  annualSavings: number;
  roiPercentage: number;
  paybackMonths: number;
  fiveYearValue: number;
}

export const firmSizeOptions = [
  { value: 'solo', label: 'Solo Practice (1 attorney)', multiplier: 0.8 },
  { value: 'small', label: 'Small Firm (2-5 attorneys)', multiplier: 1.0 },
  { value: 'medium', label: 'Medium Firm (6-15 attorneys)', multiplier: 1.3 },
  { value: 'large', label: 'Large Firm (16+ attorneys)', multiplier: 1.6 }
];

export function calculateROI(inputs: ROIInputs): ROIResults {
  const firmMultiplier = firmSizeOptions.find(f => f.value === inputs.firmSize)?.multiplier || 1.0;

  // Conservative conversion rates based on industry data
  const businessHoursConversionRate = 0.05; // 5% conversion rate for missed calls during business hours
  const afterHoursConversionRate = 0.03; // 3% conversion rate for after-hours calls (lower urgency)

  // Calculate current losses (more conservative)
  const weeklyMissedRevenue = inputs.missedCallsPerWeek * inputs.avgCaseValue * businessHoursConversionRate;
  const afterHoursRevenue = inputs.afterHoursCalls * inputs.avgCaseValue * afterHoursConversionRate;
  const currentLoss = (weeklyMissedRevenue + afterHoursRevenue) * 52 * firmMultiplier;

  // Calculate potential revenue with AI (conservative capture rates)
  const aiCaptureRate = 0.65; // 65% of missed calls can be captured by AI (some calls won't leave voicemail)
  const aiConversionImprovement = 1.15; // 15% improvement in conversion due to immediate response

  const capturedBusinessCalls = inputs.missedCallsPerWeek * aiCaptureRate;
  const capturedAfterHoursCalls = inputs.afterHoursCalls * aiCaptureRate;

  const potentialRevenue = ((capturedBusinessCalls * inputs.avgCaseValue * businessHoursConversionRate * aiConversionImprovement) +
                           (capturedAfterHoursCalls * inputs.avgCaseValue * afterHoursConversionRate * aiConversionImprovement)) * 52 * firmMultiplier;

  // Calculate operational savings (more realistic)
  const overtimeSavings = inputs.overtimeCosts * 0.4; // 40% reduction in overtime (not 70%)
  const efficiencySavings = inputs.receptionistSalary * 0.08; // 8% efficiency gain (not 15%)
  const annualSavings = overtimeSavings + efficiencySavings;

  // AI service cost (more realistic pricing)
  const aiServiceCost = 18000; // $1500/month for comprehensive service
  const netBenefit = potentialRevenue + annualSavings - aiServiceCost;

  const roiPercentage = netBenefit > 0 ? (netBenefit / aiServiceCost) * 100 : 0;
  const paybackMonths = netBenefit > 0 ? aiServiceCost / (netBenefit / 12) : 0;
  const fiveYearValue = netBenefit * 5;

  return {
    currentLoss,
    potentialRevenue,
    annualSavings,
    roiPercentage,
    paybackMonths,
    fiveYearValue
  };
}
