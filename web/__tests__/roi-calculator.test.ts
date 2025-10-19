import { calculateROI, firmSizeOptions, type ROIInputs } from '@/lib/roi-calculator';

describe('ROI Calculator', () => {
  // Default test inputs based on the component's default values
  const defaultInputs: ROIInputs = {
    firmSize: 'small',
    avgCaseValue: 8000,
    missedCallsPerWeek: 5,
    afterHoursCalls: 8,
    receptionistSalary: 42000,
    overtimeCosts: 6000
  };

  describe('Basic Calculations', () => {
    test('should calculate correct current loss for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Business hours: 5 calls * $8000 * 0.05 conversion = $2000/week
      // After hours: 8 calls * $8000 * 0.03 conversion = $1920/week
      // Total weekly: $3920
      // Annual (52 weeks): $3920 * 52 = $203,840
      // With small firm multiplier (1.0): $203,840
      
      expect(results.currentLoss).toBe(203840);
    });

    test('should calculate correct potential revenue for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Captured business calls: 5 * 0.65 = 3.25 calls
      // Captured after-hours calls: 8 * 0.65 = 5.2 calls
      // Business revenue: 3.25 * $8000 * 0.05 * 1.15 = $1495/week
      // After-hours revenue: 5.2 * $8000 * 0.03 * 1.15 = $1435.2/week
      // Total weekly: $2930.2
      // Annual: $2930.2 * 52 = $152,370.4
      // With small firm multiplier (1.0): $152,370.4
      
      expect(results.potentialRevenue).toBeCloseTo(152370.4, 1);
    });

    test('should calculate correct operational savings for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Overtime savings: $6000 * 0.4 = $2400
      // Efficiency savings: $42000 * 0.08 = $3360
      // Total: $2400 + $3360 = $5760
      
      expect(results.annualSavings).toBe(5760);
    });

    test('should calculate correct ROI percentage for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Net benefit: $152,370.4 + $5760 - $18000 = $140,130.4
      // ROI: ($140,130.4 / $18000) * 100 = 778.5%
      
      expect(results.roiPercentage).toBeCloseTo(778.5, 1);
    });

    test('should calculate correct payback period for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Net benefit: $140,130.4
      // Monthly benefit: $140,130.4 / 12 = $11,677.53
      // Payback: $18000 / $11,677.53 = 1.54 months
      
      expect(results.paybackMonths).toBeCloseTo(1.54, 2);
    });

    test('should calculate correct 5-year value for default inputs', () => {
      const results = calculateROI(defaultInputs);
      
      // Expected calculation:
      // Net benefit: $140,130.4
      // 5-year value: $140,130.4 * 5 = $700,652
      
      expect(results.fiveYearValue).toBeCloseTo(700652, 1);
    });
  });

  describe('Firm Size Multipliers', () => {
    test('should apply solo practice multiplier correctly', () => {
      const soloInputs = { ...defaultInputs, firmSize: 'solo' };
      const results = calculateROI(soloInputs);
      const baseResults = calculateROI(defaultInputs);
      
      // Solo multiplier is 0.8, so current loss should be 80% of small firm
      expect(results.currentLoss).toBeCloseTo(baseResults.currentLoss * 0.8, 1);
      expect(results.potentialRevenue).toBeCloseTo(baseResults.potentialRevenue * 0.8, 1);
    });

    test('should apply medium firm multiplier correctly', () => {
      const mediumInputs = { ...defaultInputs, firmSize: 'medium' };
      const results = calculateROI(mediumInputs);
      const baseResults = calculateROI(defaultInputs);
      
      // Medium multiplier is 1.3, so current loss should be 130% of small firm
      expect(results.currentLoss).toBeCloseTo(baseResults.currentLoss * 1.3, 1);
      expect(results.potentialRevenue).toBeCloseTo(baseResults.potentialRevenue * 1.3, 1);
    });

    test('should apply large firm multiplier correctly', () => {
      const largeInputs = { ...defaultInputs, firmSize: 'large' };
      const results = calculateROI(largeInputs);
      const baseResults = calculateROI(defaultInputs);
      
      // Large multiplier is 1.6, so current loss should be 160% of small firm
      expect(results.currentLoss).toBeCloseTo(baseResults.currentLoss * 1.6, 1);
      expect(results.potentialRevenue).toBeCloseTo(baseResults.potentialRevenue * 1.6, 1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero missed calls', () => {
      const zeroCallsInputs = {
        ...defaultInputs,
        missedCallsPerWeek: 0,
        afterHoursCalls: 0
      };
      const results = calculateROI(zeroCallsInputs);
      
      expect(results.currentLoss).toBe(0);
      expect(results.potentialRevenue).toBe(0);
      expect(results.annualSavings).toBe(5760); // Should still have operational savings
    });

    test('should handle zero case value', () => {
      const zeroCaseValueInputs = { ...defaultInputs, avgCaseValue: 0 };
      const results = calculateROI(zeroCaseValueInputs);
      
      expect(results.currentLoss).toBe(0);
      expect(results.potentialRevenue).toBe(0);
      expect(results.annualSavings).toBe(5760); // Should still have operational savings
    });

    test('should handle negative ROI scenario', () => {
      const lowValueInputs = {
        ...defaultInputs,
        avgCaseValue: 100, // Very low case value
        missedCallsPerWeek: 1,
        afterHoursCalls: 1,
        receptionistSalary: 20000,
        overtimeCosts: 1000
      };
      const results = calculateROI(lowValueInputs);
      
      // Should result in negative or very low ROI
      expect(results.roiPercentage).toBeLessThan(100);
    });

    test('should handle unknown firm size', () => {
      const unknownFirmInputs = { ...defaultInputs, firmSize: 'unknown' };
      const results = calculateROI(unknownFirmInputs);
      const baseResults = calculateROI(defaultInputs);
      
      // Should default to multiplier of 1.0 (same as small firm)
      expect(results.currentLoss).toBe(baseResults.currentLoss);
      expect(results.potentialRevenue).toBe(baseResults.potentialRevenue);
    });
  });

  describe('Mathematical Consistency', () => {
    test('should maintain proportional relationships', () => {
      const doubledInputs = {
        ...defaultInputs,
        missedCallsPerWeek: 10,
        afterHoursCalls: 16
      };
      const results = calculateROI(doubledInputs);
      const baseResults = calculateROI(defaultInputs);
      
      // Doubling calls should roughly double current loss and potential revenue
      expect(results.currentLoss).toBeCloseTo(baseResults.currentLoss * 2, 1);
      expect(results.potentialRevenue).toBeCloseTo(baseResults.potentialRevenue * 2, 1);
    });

    test('should have consistent conversion rates', () => {
      const results = calculateROI(defaultInputs);
      
      // Business hours conversion rate: 5%
      // After hours conversion rate: 3%
      // AI capture rate: 65%
      // AI improvement: 15%
      
      const expectedBusinessRevenue = 5 * 8000 * 0.05 * 52; // $104,000
      const expectedAfterHoursRevenue = 8 * 8000 * 0.03 * 52; // $99,840
      const expectedCurrentLoss = expectedBusinessRevenue + expectedAfterHoursRevenue; // $203,840
      
      expect(results.currentLoss).toBe(expectedCurrentLoss);
    });

    test('should have realistic AI service cost impact', () => {
      const results = calculateROI(defaultInputs);
      
      // AI service cost should be $18,000 annually
      const aiServiceCost = 18000;
      const netBenefit = results.potentialRevenue + results.annualSavings - aiServiceCost;
      
      expect(results.roiPercentage).toBeCloseTo((netBenefit / aiServiceCost) * 100, 1);
      expect(results.paybackMonths).toBeCloseTo(aiServiceCost / (netBenefit / 12), 2);
    });
  });

  describe('Firm Size Options', () => {
    test('should have correct firm size options', () => {
      expect(firmSizeOptions).toHaveLength(4);
      expect(firmSizeOptions[0]).toEqual({ value: 'solo', label: 'Solo Practice (1 attorney)', multiplier: 0.8 });
      expect(firmSizeOptions[1]).toEqual({ value: 'small', label: 'Small Firm (2-5 attorneys)', multiplier: 1.0 });
      expect(firmSizeOptions[2]).toEqual({ value: 'medium', label: 'Medium Firm (6-15 attorneys)', multiplier: 1.3 });
      expect(firmSizeOptions[3]).toEqual({ value: 'large', label: 'Large Firm (16+ attorneys)', multiplier: 1.6 });
    });
  });

  describe('Real-World Scenarios', () => {
    test('should calculate ROI for high-value personal injury firm', () => {
      const personalInjuryInputs: ROIInputs = {
        firmSize: 'medium',
        avgCaseValue: 50000, // High-value PI cases
        missedCallsPerWeek: 8,
        afterHoursCalls: 12,
        receptionistSalary: 45000,
        overtimeCosts: 8000
      };

      const results = calculateROI(personalInjuryInputs);

      // Should show very high ROI due to high case values
      expect(results.currentLoss).toBeGreaterThan(1000000); // Over $1M in lost revenue
      expect(results.roiPercentage).toBeGreaterThan(2000); // Over 2000% ROI
      expect(results.paybackMonths).toBeLessThan(1); // Less than 1 month payback
    });

    test('should calculate ROI for small family law practice', () => {
      const familyLawInputs: ROIInputs = {
        firmSize: 'solo',
        avgCaseValue: 3000, // Lower-value family law cases
        missedCallsPerWeek: 3,
        afterHoursCalls: 5,
        receptionistSalary: 35000,
        overtimeCosts: 3000
      };

      const results = calculateROI(familyLawInputs);

      // Should still show positive ROI but more modest
      expect(results.currentLoss).toBeGreaterThan(30000);
      expect(results.roiPercentage).toBeGreaterThan(100); // Still profitable
      expect(results.paybackMonths).toBeLessThan(12); // Less than 1 year payback
    });

    test('should calculate ROI for large corporate law firm', () => {
      const corporateLawInputs: ROIInputs = {
        firmSize: 'large',
        avgCaseValue: 25000, // Mid-range corporate cases
        missedCallsPerWeek: 15,
        afterHoursCalls: 20,
        receptionistSalary: 55000,
        overtimeCosts: 12000
      };

      const results = calculateROI(corporateLawInputs);

      // Should show very high absolute numbers due to large firm multiplier
      expect(results.currentLoss).toBeGreaterThan(500000);
      expect(results.potentialRevenue).toBeGreaterThan(300000);
      expect(results.fiveYearValue).toBeGreaterThan(2000000);
    });
  });

  describe('Calculation Constants Verification', () => {
    test('should use correct conversion rates', () => {
      // Test that the hardcoded rates match expectations
      const testInputs = {
        ...defaultInputs,
        missedCallsPerWeek: 10,
        afterHoursCalls: 10,
        avgCaseValue: 1000
      };

      const results = calculateROI(testInputs);

      // Business hours: 10 * 1000 * 0.05 * 52 = $26,000
      // After hours: 10 * 1000 * 0.03 * 52 = $15,600
      // Total: $41,600
      expect(results.currentLoss).toBe(41600);
    });

    test('should use correct AI performance metrics', () => {
      const testInputs = {
        ...defaultInputs,
        missedCallsPerWeek: 10,
        afterHoursCalls: 10,
        avgCaseValue: 1000
      };

      const results = calculateROI(testInputs);

      // AI capture rate: 65%
      // AI improvement: 15%
      // Business: 10 * 0.65 * 1000 * 0.05 * 1.15 * 52 = $19,370
      // After hours: 10 * 0.65 * 1000 * 0.03 * 1.15 * 52 = $11,622
      // Total: $30,992
      expect(results.potentialRevenue).toBeCloseTo(30992, 0);
    });

    test('should use correct operational savings rates', () => {
      const testInputs = {
        ...defaultInputs,
        receptionistSalary: 50000,
        overtimeCosts: 10000
      };

      const results = calculateROI(testInputs);

      // Overtime savings: 10000 * 0.4 = $4,000
      // Efficiency savings: 50000 * 0.08 = $4,000
      // Total: $8,000
      expect(results.annualSavings).toBe(8000);
    });

    test('should use correct AI service cost', () => {
      const results = calculateROI(defaultInputs);

      // AI service cost should be $18,000 annually ($1,500/month)
      const aiServiceCost = 18000;
      const netBenefit = results.potentialRevenue + results.annualSavings - aiServiceCost;

      // Verify ROI calculation uses this cost
      expect(results.roiPercentage).toBeCloseTo((netBenefit / aiServiceCost) * 100, 1);
    });
  });
});
