// New kind for each item, this way we can assign ontap events to our repeater items
enyo.kind({
    name: "germboy.DateScrollerRowItem",
    events: {
        onItemTap: ""
    },
    components: [
           {name: "item", classes: "dateScrollerItem", ontap: "itemTap"}
    ],
    create: function() {
		this.inherited(arguments);
		this.applyStyle("height", this.itemHeight + "px");
		this.applyStyle("line-height", this.itemHeight + "px");
	},
    itemTap: function() {
        this.doItemTap();
    }
});

enyo.kind({
	name: "germboy.DateScrollerColumn",
	kFrictionDamping: 0.8,
	handlers: {
		onItemTap: "itemTap"
	},
	dragStartPos: undefined,
	create: function() {
		this.inherited(arguments);
		
		// forcing to true for the time being. WP7 drag-support is too much of a headache right now
		this.params.touchEvents = true;
		
		var component = 
			{kind: "enyo.Scroller", horizontal: "hidden", touch: this.params.touchEvents, onScrollStop: "dateScrollerStop", components: [
				{components: this.params.paddingItems},
				{kind: "enyo.Repeater", name: "repeater", onSetupRow: "setupRows", style: "position: relative;", components: [
					//{name: "item", classes: "dateScrollerItem"}
					{kind: "germboy.DateScrollerRowItem", name: "dateScrollerRowItem", itemHeight: this.params.itemHeight}
				]},
				{components: this.params.paddingItems}
		]};
		this.createComponents([component]);
		
		this.$.repeater.setRows(this.items.length);
		
		if (this.params.touchEvents) {
			// Make snap-back a bit quicker
			this.$.scroller.$.strategy.$.scrollMath.kFrictionDamping = this.kFrictionDamping;
		}
		
	},
	
	itemTap: function(inSender, inEvent) {
        
		// If we support touchEvents, things are easy
		if (this.params.touchEvents) {
			this.scrollToIndex(inEvent.originator.container.rowIndex);
        	
		} else {
        	
	        var rowIndex = inEvent.originator.container.rowIndex;
	        this.params.startIndex = rowIndex;
	        var yPos = (this.params.itemHeight * rowIndex);
			this.$.scroller.setScrollTop(yPos);
			
			var selectedItem = {
				role: this.params.role,
				index: rowIndex,
				label: this.items[rowIndex].label,
				value: this.items[rowIndex].value
			};
			
			this.bubbleUp("onUpdateSelectedItems", {selectedItem: selectedItem, notify: true});
			
		}
    },
	rendered: function() {
		this.inherited(arguments);
		
		this.$.repeater.build();
		this.$.repeater.render();
		
		var scrollerHeight = (this.params.itemHeight * this.params.visibleRows);
		this.$.scroller.applyStyle("height", scrollerHeight + "px");
		
		this.bubbleUp("onRepeaterRender", this.$.repeater);
	},
	scrollToIndex: function(index) {
		var yPos = (this.params.itemHeight * index); //this.params.startIndex);
		this.$.scroller.scrollTo(0, yPos);
	},
	silentScrollToIndex: function(notify) {
		var yPos = (this.params.itemHeight * this.params.startIndex);
		this.$.scroller.setScrollTop(yPos);
		
		this.bubbleUp("onUpdateSelectedItems", {selectedItem: this.getSelectedItem(this.params.startIndex), notify: notify});
	},
	setupRows: function(inSender, inEvent) {
		var index = inEvent.index;
		var rowControl = inEvent.row;
		
		rowControl.$.dateScrollerRowItem.$.item.setContent( this.items[index].label );
	},
	updateItems: function(items) {
		delete this.items;
		this.items = items;
	},
	getSelectedItem: function(index) {
		
		var selectedItem = {
			role: this.params.role,
			index: index,
			label: this.items[index].label,
			value: this.items[index].value
		};
		
		return selectedItem;
	},
	dateScrollerStop: function(inSender, inEvent) {
		
		var hackHeight = (this.params.itemHeight - 1);
		var divisible = inSender.getScrollBounds().top % this.params.itemHeight;
		
		// If the scroll position is snapped where it should be - based on this.params.itemHeight
		// Second conditional is a hack - After calling scrollTo(0, 60), sometimes it actually scrolls to (0, 59). Dont think it's a padding/margin/border issue
		if ( (divisible === 0) || (divisible === hackHeight) ) {
			
			var itemSelected = (divisible === hackHeight) ? (inSender.getScrollBounds().top + 1) : inSender.getScrollBounds().top;
			var itemIndex = itemSelected / this.params.itemHeight;
			
			var selectedItem = {
				role: this.params.role,
				index: itemIndex,
				label: this.items[itemIndex].label,
				value: this.items[itemIndex].value
			};
			
			this.bubbleUp("onUpdateSelectedItems", {selectedItem: selectedItem, notify: true});
			
		// Else, force a "snap-scroll" to the nearest divisible px position to this.params.itemHeight
		} else {
			var roundedInt = this.roundInt(inSender.getScrollBounds().top, this.params.itemHeight);
			inSender.scrollTo( 0, roundedInt );
		}
		
		// Stop bubbling
		return true;
		
	},
	roundInt: function (value, increment) {
		
		var remain = value % increment;
		var roundvalue = increment / 2;
		
		// round up
		if (remain >= roundvalue){
			var result = value - remain; 
			result += increment;
		
		// round down
		} else {
			var result = value - remain;
		}
		
		return result;
	}
});

enyo.kind({
	name: "germboy.MonthScroller",
	classes: "monthScrollerColumn",
	items: [
		{label: "January", value: 1}, 
		{label: "February", value: 2}, 
		{label: "March", value: 3}, 
		{label: "April", value: 4}, 
		{label: "May", value: 5}, 
		{label: "June", value: 6}, 
		{label: "July", value: 7}, 
		{label: "August", value: 8}, 
		{label: "September", value: 9}, 
		{label: "October", value: 10}, 
		{label: "November", value: 11}, 
		{label: "December", value: 12}
	],
	create: function() {
		this.inherited(arguments);
		
		this.params.role = "month";
		var component = {kind: "germboy.DateScrollerColumn", items: this.items, params: this.params};
		this.createComponents([component]);
	}
});
enyo.kind({
	name: "germboy.DayScroller",
	classes: "dayScrollerColumn",
	handlers: {
		onRepeaterRender: "repeaterRender"
	},
	items: [],
	create: function() {
		this.inherited(arguments);
		
		this.params.role = "day";
		
		var component = {kind: "germboy.DateScrollerColumn", items: this.items, params: this.params};
		this.createComponents([component]);
	},
	repeaterRender: function(inSender, inEvent) {
		this.repeater = inEvent;
		return true;
	},
	setDays: function(len) {
		
		delete this.items;
		this.items = [];
		
		var i;
		for (i=0; i<len; i++) {
			this.items.push({label: (i+1), value: i});
		}
		
		this.repeater.destroyClientControls();
		
		this.$.dateScrollerColumn.updateItems(this.items);
		
		this.repeater.setRows(this.items.length);
		this.repeater.build();
		this.repeater.render();
	}
});

enyo.kind({
	name: "germboy.YearScroller",
	classes: "yearScrollerColumn",
	published: {
		params: null
	},
	items: [],
	create: function() {
		this.inherited(arguments);
		
		var year = this.params.minYear;
		var range = (year + this.params.range);
		
		for (i=year; i<range; i++) {
			this.items.push({label: i, value: i});
			
			if (i === this.params.startIndex) {
				this.params.startIndex = (this.items.length-1);
			}
		}
		
		this.params.role = "year";
		var component = {kind: "germboy.DateScrollerColumn", items: this.items, params: this.params};
		this.createComponents([component]);
	}
});

enyo.kind({
	name: "germboy.DateScroller",
	classes: "dateScroller",
	published: {
		itemHeight: 60,
		rangeYears: 5,
		visibleRows: 3,
		minYear: undefined,
		monthValue: undefined,
		dayValue: undefined,
		yearValue: undefined,
		dateFormat: [{value: "m", fit: true},{value: "d", fit: false},{value: "y", fit: false}]
	},
	handlers: {
		onUpdateSelectedItems: "updateSelectedItems"
	},
	events: {
		onDateSelected: ""
	},
	selectedItems: {
		month: undefined,
		day: undefined,
		year: undefined
	},
	touchEvents: true,
	create: function() {
		this.inherited(arguments);
		this.d = new Date();
		
		// Windows Phone (ex: Windows Phone OS 7.5) doesn't have touch events & isn't found in enyo.platform, so we do it manually
		if (enyo.platform.ie) {
			var regex = /windows phone os (\d+)/i
			var match = regex.exec(navigator.userAgent);
			if (match) {
				enyo.platform["winphone"] = Number(match[1]);
				this.touchEvents = false;
			}
		}
		
		// Needs to at least be 3 rows tall
		if ( this.getVisibleRows() < 3 ) {
			this.setVisibleRows( 3 );
			
		// else, force visible rows to be an odd number
		} else if (this.getVisibleRows() % 2 === 0) {
			this.setVisibleRows( this.getVisibleRows() - 1 );
		}
		
		// Based on this.visibleRows, we need to add spacers on the top & bottom of each column
		var blankItemCount = ((1 + this.getVisibleRows()) / 2) - 1;
		var blankItem = {
			classes: "dateScrollerItem",
			itemHeight: this.getItemHeight(),
			rendered: function() {this.applyStyle("height", this.itemHeight + "px");}
		};
		var i;
		var paddingItems = [];
		for (i=0; i<blankItemCount; i++) {
			paddingItems.push(blankItem);
		}
		
		// If minYear wasn't set by user, use the current year
		this.minYear = (this.minYear === undefined) ? this.d.getFullYear() : this.minYear;
		
		var paramsMonth = {
			touchEvents: this.touchEvents,
			paddingItems: paddingItems,
			d: this.d,
			itemHeight: this.getItemHeight(),
			visibleRows: this.visibleRows,
			startIndex: (this.getMonthValue() === undefined) ? 0 : (this.getMonthValue() - 1)
		};
		var paramsDay = {
			touchEvents: this.touchEvents,
			paddingItems: paddingItems,
			d: this.d,
			itemHeight: this.getItemHeight(),
			visibleRows: this.visibleRows,
			startIndex: (this.getDayValue() === undefined) ? 0 : (this.getDayValue() - 1)
		};
		var paramsYear = {
			touchEvents: this.touchEvents,
			paddingItems: paddingItems,
			d: this.d,
			itemHeight: this.getItemHeight(),
			range: this.getRangeYears(),
			visibleRows: this.visibleRows,
			startIndex: (this.getYearValue() === undefined) ? 0 : (this.getYearValue()),
			minYear: this.minYear
		};
		
		// find the average of our min/max rows
		var average = (1 + this.getVisibleRows()) / 2;
		
		var highlight = {classes: "dateScrollerHighlight", name: "highlight"}
		
		// Setup our kinds object
		var kindOrder = {
			m: {kind: "germboy.MonthScroller", params: paramsMonth, fit: false},
			d: {kind: "germboy.DayScroller", params: paramsDay, fit: false},
			y: {kind: "germboy.YearScroller", params: paramsYear, fit: false}
		};
		
		// Specify which column will fit the remainder of the DateScroller container
		kindOrder[this.dateFormat[0].value].fit = ((this.dateFormat[0].fit === undefined) || (this.dateFormat[0].fit === false)) ? false : true;
		kindOrder[this.dateFormat[1].value].fit = ((this.dateFormat[1].fit === undefined) || (this.dateFormat[1].fit === false)) ? false : true;
		kindOrder[this.dateFormat[2].value].fit = ((this.dateFormat[2].fit === undefined) || (this.dateFormat[2].fit === false)) ? false : true;
		if ((!kindOrder.m.fit) && (!kindOrder.d.fit) && (!kindOrder.y.fit)) kindOrder.m.fit = true;
		
		// Insert components in the specified order
		var components = [
			{kind: "FittableColumns", components: [
				{kind: kindOrder[this.dateFormat[0].value].kind, params: kindOrder[this.dateFormat[0].value].params, fit: kindOrder[this.dateFormat[0].value].fit},
				{kind: kindOrder[this.dateFormat[1].value].kind, params: kindOrder[this.dateFormat[1].value].params, fit: kindOrder[this.dateFormat[1].value].fit},
				{kind: kindOrder[this.dateFormat[2].value].kind, params: kindOrder[this.dateFormat[2].value].params, fit: kindOrder[this.dateFormat[2].value].fit}
			]},
			highlight
		];
		
		
		this.createComponents(components);
		
		this.$.highlight.applyStyle("height", this.itemHeight + "px");
		
		// Calculate highlight position and subtract our 2px for padding/border
		var highlightPos = ((average * this.itemHeight) - this.itemHeight) - 2;
		this.$.highlight.applyStyle("top", highlightPos + "px");
		
	},
	rendered: function() {
		this.inherited(arguments);
		
		// Shortcuts
		var monthScroller = this.$.monthScroller;
		var dayScroller = this.$.dayScroller;
		var yearScroller = this.$.yearScroller;
		
		// Set starting month/year
		var selectedMonthValue = monthScroller.$.dateScrollerColumn.getSelectedItem( monthScroller.params.startIndex ).value;
		var selectedYearValue = yearScroller.$.dateScrollerColumn.getSelectedItem( yearScroller.params.startIndex ).value;
		
		// Scroll to month/year position, without triggering onScrollStop
		monthScroller.$.dateScrollerColumn.silentScrollToIndex(false);
		yearScroller.$.dateScrollerColumn.silentScrollToIndex(false);
		
		// Get # of days in given month/year & scroll to position
		this.$.dayScroller.setDays( this.daysInMonth(selectedMonthValue, selectedYearValue) );
		this.$.dayScroller.$.dateScrollerColumn.silentScrollToIndex(true);
		
		// Programatically set min-width, based on column width values that user may change
		if ( (dayScroller.hasNode()) && (yearScroller.hasNode()) && (monthScroller.hasNode()) ) {
			var dayColWidth = dayScroller.node.offsetWidth;
			var yearColWidth = yearScroller.node.offsetWidth;
			
			monthScroller.applyStyle("min-width", "150px");
			var monthColMinWidth = parseInt(monthScroller.node.style.minWidth, 10);
			
			this.applyStyle("min-width", (dayColWidth + yearColWidth + monthColMinWidth) + "px");
		}
		
		
	},
	daysInMonth: function(month, year) {
		return new Date(year, month, 0).getDate();
	},
	updateSelectedItems: function(inSender, inEvent) {
		
		var resetDayScroller = false;
		var oldDaysInMonth = this.$.dayScroller.items.length;
		
		if ( inEvent.notify ) {
			if ( (inEvent.selectedItem.role === "month") && (this.selectedItems[inEvent.selectedItem.role].value !== inEvent.selectedItem.value) ) {
				
				var newDaysInMonth = this.daysInMonth(inEvent.selectedItem.value, this.selectedItems.year.value);
				this.$.dayScroller.setDays( newDaysInMonth );
				
				if (oldDaysInMonth > newDaysInMonth) {
					resetDayScroller = true;
				}
				
			} else if ( (inEvent.selectedItem.role === "year") && (this.selectedItems[inEvent.selectedItem.role].value !== inEvent.selectedItem.value) ) {
				
				var newDaysInMonth = this.daysInMonth(this.selectedItems.month.value, inEvent.selectedItem.value);
				this.$.dayScroller.setDays( newDaysInMonth );
				
				if (oldDaysInMonth > newDaysInMonth) {
					resetDayScroller = true;
				}
			}
		}
		
		
		this.selectedItems[inEvent.selectedItem.role] = inEvent.selectedItem;
		
		
		// Reset day scroller before sending onDateSelected event
		if (resetDayScroller) {
			
			if (this.selectedItems.day.index >= this.$.dayScroller.$.dateScrollerColumn.params.startIndex) {
				this.$.dayScroller.$.dateScrollerColumn.params.startIndex = (newDaysInMonth-1);
			} else if (this.selectedItems.day.index < this.$.dayScroller.$.dateScrollerColumn.params.startIndex) {
				this.$.dayScroller.$.dateScrollerColumn.params.startIndex = this.selectedItems.day.index;
			}
			
			this.$.dayScroller.$.dateScrollerColumn.silentScrollToIndex(true);
		} else if ( inEvent.notify ) {
			
			//this.bubbleUp("onDateSelected", {selectedDate: this.selectedItems});
			this.doDateSelected({selectedDate: this.selectedItems});
		}
		
		
		return true;
	},
	getDate: function() {
		return this.selectedItems;
	},
	setMonth: function(index) {
		this.$.monthScroller.$.dateScrollerColumn.scrollToIndex(index);
	},
	setDay: function(index) {
		this.$.dayScroller.$.dateScrollerColumn.scrollToIndex(index);
	},
	setYear: function(index) {
		this.$.yearScroller.$.dateScrollerColumn.scrollToIndex(index);
	}
	
});