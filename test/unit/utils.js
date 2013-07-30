'use strict';

describe('remove one value of an array', function() {
	it('should remove the value on the same array reference', function() {
		var exampleArray = [1, 2, 3, 4, 5];
		var iterator = function(value) {
			return 4 === value;
		};
		hdv.array.remove(exampleArray, iterator);

		expect(exampleArray.length).toEqual(4);
	});
});
