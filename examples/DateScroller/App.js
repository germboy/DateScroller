enyo.kind({
	name: "App",
	classes: "enyo-unselectable enyo-fit",
	components: [
		{kind: "onyx.Toolbar", content: "DateScroller Demo", style: "background-color: #2B4E69;"},
		
		{classes: "container", components: [
			
			
				{
					kind: "germboy.DateScroller", 
					monthValue: 1, 
					dayValue: 31, 
					yearValue: 2012, 
					minYear: 2011,
					rangeYears: 10, 
					visibleRows: 5,
					//dateFormat: [{value: "d"},{value: "m", fit: true},{value: "y"}],
					onDateSelected: "dateSelected"
				},
				
				{name: "selectedDate", style: "padding:18px 0px 0px 4px;"},
				
				{tag: "br"},
				
					{kind: "onyx.Button", ontap: "setMonth", content: ".setMonth(1)", style: "margin: 6px;"},{tag: "br"},
					{kind: "onyx.Button", ontap: "setDay", content: ".setDay(27)", style: "margin: 6px;"},{tag: "br"},
					{kind: "onyx.Button", ontap: "setYear", content: ".setYear(1)", style: "margin: 6px;"},
				
				{tag: "br"},
				{style: "white-space:nowrap;", components: [
					{kind: "onyx.Button", ontap: "getDate", content: ".getDate()", style: "margin: 6px 4px 0px 6px;"},
					{name: "getDateResult", style: "padding:10px; display:inline;"}
				]}
				
			
		]}
		
	],
	dateSelected: function(inSender, inEvent) {
		
		var selectedMonth = inEvent.selectedDate.month;
		var selectedDay = inEvent.selectedDate.day;
		var selectedYear = inEvent.selectedDate.year;
		
		this.$.selectedDate.setContent( selectedMonth.label + " " + selectedDay.label + " " + selectedYear.label );
		
	},
	setMonth: function() {
		this.$.dateScroller.setMonth(1);
	},
	setDay: function() {
		this.$.dateScroller.setDay(27);
	},
	setYear: function() {
		this.$.dateScroller.setYear(1);
	},
	getDate: function(inSender, inEvent) {
		
		var selectedDate = this.$.dateScroller.getDate();
		
		var selectedMonth = selectedDate.month;
		var selectedDay = selectedDate.day;
		var selectedYear = selectedDate.year;
		
		this.$.getDateResult.setContent( selectedMonth.label + " " + selectedDay.label + " " + selectedYear.label );
		
	}
	
	
});
