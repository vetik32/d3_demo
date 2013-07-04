describe('filter', function () {

  beforeEach(module('sjDates'));

  describe('date filters', function () {

    it('should format date to full "dayFullName, monthFullName date" ',
        inject(function (sjDateFilter) {
          expect(sjDateFilter(1288323623006)).toBe('Friday, October 29');
        }));
  });
});
