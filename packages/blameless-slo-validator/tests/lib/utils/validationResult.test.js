const sloSchema = require('../../../lib/schema/sloSchema');
const validationResult = require('../../../lib/utils/validationResult');

describe('Validation Result', () => {
    const validValueMetrics = [ 's', 'ms', 'rps', 'rpm', 'GB', '%' ];
    it.each(validValueMetrics)('slo allows valid valueMetric "%s"', (valueMetric) => {
        // Assemble
        const sliDocument = {
            apiVersion: 'blameless/v1alpha',
            kind: 'SLO',
            metadata: {
                name: 'test',
                displayName: 'test',
                userJourney: 'test user journey'
            },
            spec: {
                description: 'test description',
                owner: 'someone@blameless.com',
                sloStatus: 'development',
                sliName: 'sli test',
                target: 95.5,
                op: 'gte',
                value: 1,
                valueMetric: valueMetric
            },
        };

        // Act
        const result = validationResult(sliDocument, sloSchema);

        // Assert
        expect(result.error).toBeFalsy();
    });

    const invalidValueMetrics = [ undefined, null, '', ' ', 'gb', 'm' ];
    it.each(invalidValueMetrics)('slo fails invalid valueMetric "%s"', (valueMetric) => {
        // Assemble
        const sliDocument = {
            apiVersion: 'blameless/v1alpha',
            kind: 'SLO',
            metadata: {
                name: 'test',
                displayName: 'test',
                userJourney: 'test user journey'
            },
            spec: {
                description: 'test description',
                owner: 'someone@blameless.com',
                sloStatus: 'development',
                sliName: 'sli test',
                target: 95.5,
                op: 'gte',
                value: 1,
                valueMetric: valueMetric
            },
        };

        // Act
        const result = validationResult(sliDocument, sloSchema);

        // Assert
        expect(result.error).toBeTruthy();
    });
})