DateScroller for Enyo 2
====================

Version
-----

1.1


About
-----

This is a Secha/iOS-style date picker/scroller control for Enyo 2. Scroll through the columns or tap on row items to scroll to that date.


How to Use
----------

First include the DateScroller lib:

	<script src="../../DateScroller/package.js" type="text/javascript"></script>
	
You will also need to include the Fittables lib:

    <script src="../../../../lib/layout/fittable/package.js" type="text/javascript"></script>


Then instantiate your DateScroller kind:

	{kind: "germboy.DateScroller", onDateSelected: "dateSelected"}


Properties
----------

- monthValue -> Integer: Specifies the initially selected month. (1 = January)
- dayValue -> Integer: Specifies the initially selected day.
- yearValue -> Integer: Specifies the initially selected year.
- minYear -> Integer: Specifies the minimum year the DateScroller will show.
- rangeYears -> Integer: Specifies the number of years the DateScroller will make available.
- visibleRows -> Integer: Specifies the amount of rows that will be visible to the user. Must be an odd number! If value is an even number, value will be decreased by 1.
- dateFormat -> Object Array: Specifies the order of your columns (m/d/y). If used, array must contain 3 objects containing value properties of "m", "d", and "y". For layout control, you can also specify a fit property on the column you want to fill the remainder of the DateScroller container. Ex: dateFormat:[{value: "d"},{value: "m", fit: true},{value: "y"}]


Methods
-------
	
- .getDate( ) -> Returns an object of the currently selected date.
- .setMonth( index ) -> Scrolls the DateScroller's month column to the index passed. (Ex: 1 = February)
- .setDay( index ) -> Scrolls the DateScroller's day column to the index passed.
- .setYear( index ) -> Scrolls the DateScroller's year column to the index passed.


Events
------

- onDateSelected: "" -> Returns an object containing the currently selected date.


Demos
-----

- http://www.variablelimit.com/enyo/lib/germboy/DateScroller/examples/DateScroller/


Changelog
---------

1.1 - Added dateFormat property to specify the column order (m/d/y)
1.0 - Initial release
