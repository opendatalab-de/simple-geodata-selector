'use strict';

describe('filter feature collection by RS key', function() {
	it('return an empty list for no matches', function() {
		var result = sgs.exporter.filterFeatures(testData, [ "99" ]);
		expect(result.features.length).toBe(0);

	});
	it('return one matched element', function() {
		var result = sgs.exporter.filterFeatures(testData, [ "04" ]);
		expect(result.features.length).toBe(1);
		var featureProp = result.features[0].properties;
		expect(featureProp.RS).toBe('04011');
	});
});
