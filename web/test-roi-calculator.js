// Simple test script to verify ROI calculator math
// Run with: node test-roi-calculator.js

const firmSizeOptions = [
  { value: 'solo', label: 'Solo Practice (1 attorney)', multiplier: 0.8 },
  { value: 'small', label: 'Small Firm (2-5 attorneys)', multiplier: 1.0 },
  { value: 'medium', label: 'Medium Firm (6-15 attorneys)', multiplier: 1.3 },
  { value: 'large', label: 'Large Firm (16+ attorneys)', multiplier: 1.6 }
];

function calculateROI(inputs) {
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

// Test with default inputs
const defaultInputs = {
  firmSize: 'small',
  avgCaseValue: 8000,
  missedCallsPerWeek: 5,
  afterHoursCalls: 8,
  receptionistSalary: 42000,
  overtimeCosts: 6000
};

console.log('🧮 ROI Calculator Math Verification\n');
console.log('📊 Default Inputs:');
console.log('  - Firm Size: Small (multiplier: 1.0)');
console.log('  - Average Case Value: $8,000');
console.log('  - Missed Calls/Week: 5');
console.log('  - After-Hours Calls/Week: 8');
console.log('  - Receptionist Salary: $42,000');
console.log('  - Overtime Costs: $6,000\n');

const results = calculateROI(defaultInputs);

console.log('💰 Calculated Results:');
console.log(`  - Current Annual Loss: $${results.currentLoss.toLocaleString()}`);
console.log(`  - Potential Revenue Recovery: $${results.potentialRevenue.toLocaleString()}`);
console.log(`  - Operational Savings: $${results.annualSavings.toLocaleString()}`);
console.log(`  - ROI Percentage: ${results.roiPercentage.toFixed(1)}%`);
console.log(`  - Payback Period: ${results.paybackMonths.toFixed(1)} months`);
console.log(`  - 5-Year Value: $${results.fiveYearValue.toLocaleString()}\n`);

// Manual verification of key calculations
console.log('🔍 Manual Verification:');

// Current Loss Calculation
const businessHoursLoss = 5 * 8000 * 0.05 * 52; // $104,000
const afterHoursLoss = 8 * 8000 * 0.03 * 52; // $99,840
const totalCurrentLoss = businessHoursLoss + afterHoursLoss; // $203,840
console.log(`  - Business Hours Loss: $${businessHoursLoss.toLocaleString()}`);
console.log(`  - After Hours Loss: $${afterHoursLoss.toLocaleString()}`);
console.log(`  - Total Current Loss: $${totalCurrentLoss.toLocaleString()}`);
console.log(`  - Matches calculated: ${results.currentLoss === totalCurrentLoss ? '✅' : '❌'}\n`);

// Potential Revenue Calculation
const capturedBusiness = 5 * 0.65 * 8000 * 0.05 * 1.15 * 52; // $97,370
const capturedAfterHours = 8 * 0.65 * 8000 * 0.03 * 1.15 * 52; // $55,000.4
const totalPotentialRevenue = capturedBusiness + capturedAfterHours; // $152,370.4
console.log(`  - Captured Business Revenue: $${capturedBusiness.toLocaleString()}`);
console.log(`  - Captured After-Hours Revenue: $${capturedAfterHours.toLocaleString()}`);
console.log(`  - Total Potential Revenue: $${totalPotentialRevenue.toLocaleString()}`);
console.log(`  - Matches calculated: ${Math.abs(results.potentialRevenue - totalPotentialRevenue) < 1 ? '✅' : '❌'}\n`);

// Operational Savings
const overtimeSavings = 6000 * 0.4; // $2,400
const efficiencySavings = 42000 * 0.08; // $3,360
const totalSavings = overtimeSavings + efficiencySavings; // $5,760
console.log(`  - Overtime Savings: $${overtimeSavings.toLocaleString()}`);
console.log(`  - Efficiency Savings: $${efficiencySavings.toLocaleString()}`);
console.log(`  - Total Operational Savings: $${totalSavings.toLocaleString()}`);
console.log(`  - Matches calculated: ${results.annualSavings === totalSavings ? '✅' : '❌'}\n`);

// ROI Calculation
const aiServiceCost = 18000;
const netBenefit = totalPotentialRevenue + totalSavings - aiServiceCost; // $140,130.4
const expectedROI = (netBenefit / aiServiceCost) * 100; // 778.5%
const expectedPayback = aiServiceCost / (netBenefit / 12); // 1.54 months
console.log(`  - AI Service Cost: $${aiServiceCost.toLocaleString()}`);
console.log(`  - Net Benefit: $${netBenefit.toLocaleString()}`);
console.log(`  - Expected ROI: ${expectedROI.toFixed(1)}%`);
console.log(`  - Calculated ROI: ${results.roiPercentage.toFixed(1)}%`);
console.log(`  - ROI Matches: ${Math.abs(results.roiPercentage - expectedROI) < 0.1 ? '✅' : '❌'}`);
console.log(`  - Expected Payback: ${expectedPayback.toFixed(2)} months`);
console.log(`  - Calculated Payback: ${results.paybackMonths.toFixed(2)} months`);
console.log(`  - Payback Matches: ${Math.abs(results.paybackMonths - expectedPayback) < 0.01 ? '✅' : '❌'}\n`);

// Test different firm sizes
console.log('🏢 Firm Size Multiplier Tests:');
['solo', 'small', 'medium', 'large'].forEach(firmSize => {
  const testInputs = { ...defaultInputs, firmSize };
  const testResults = calculateROI(testInputs);
  const multiplier = firmSizeOptions.find(f => f.value === firmSize).multiplier;
  const expectedLoss = totalCurrentLoss * multiplier;
  
  console.log(`  - ${firmSize.toUpperCase()}: Loss $${testResults.currentLoss.toLocaleString()} (expected: $${expectedLoss.toLocaleString()}) ${testResults.currentLoss === expectedLoss ? '✅' : '❌'}`);
});

console.log('\n✨ ROI Calculator Math Verification Complete!');
