
        // Use the current date for initialization for a truly dynamic feel
        let currentDate = new Date();
        currentDate.setDate(1); // Set to the 1st to ensure proper month calculation

        // Dummy Habit data (Day: [habit1, habit2, ...])
        // Habit completion is randomized slightly for variety
        const HABIT_NAMES = {
            exercise: 'Morning Workout',
            reading: '30-min Reading',
            meditation: 'Mindfulness Meditation',
            water: '8 Glasses of Water'
        };

        // Generates random habit data for a month
        function generateRandomHabitData(year, month) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const data = {};
            const availableHabits = Object.keys(HABIT_NAMES);
            
            for (let day = 1; day <= daysInMonth; day++) {
                // Randomly assign a subset of habits for each day
                if (Math.random() > 0.3) { // 70% chance of having habits
                    data[day] = availableHabits.filter(() => Math.random() > 0.4); // 60% chance for each habit
                }
            }
            // Ensure the current day has some data for demonstration
            if (year === new Date().getFullYear() && month === new Date().getMonth()) {
                const today = new Date().getDate();
                if (!data[today] || data[today].length === 0) {
                    data[today] = availableHabits.filter(() => Math.random() > 0.5);
                    if (data[today].length === 0) data[today].push('exercise'); // Make sure it's not totally empty
                }
            }
            return data;
        }

        let currentHabitData = generateRandomHabitData(currentDate.getFullYear(), currentDate.getMonth());

        function updateHeaderDate() {
            const headerDateElement = document.getElementById('headerDate');
            headerDateElement.textContent = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            
            // Re-generate dummy data for the new month
            currentHabitData = generateRandomHabitData(year, month); 
            
            // Update month display
            document.getElementById('currentMonth').textContent = 
                currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            // Get first day of month (0=Sun, 6=Sat) and number of days
            const firstDayIndex = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();
            const today = new Date();
            const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
            
            // Clear existing days (keep headers)
            const headers = Array.from(grid.querySelectorAll('.calendar-day-header'));
            grid.innerHTML = '';
            headers.forEach(header => grid.appendChild(header));
            
            // 1. Add previous month days
            for (let i = 0; i < firstDayIndex; i++) {
                const day = daysInPrevMonth - firstDayIndex + i + 1;
                const dayElement = createDayElement(day, true);
                grid.appendChild(dayElement);
            }
            
            // 2. Add current month days
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = createDayElement(day, false);
                
                // Highlight today
                if (isCurrentMonth && day === today.getDate()) {
                    dayElement.classList.add('today');
                }

                // Add habit dots
                const habits = currentHabitData[day] || [];
                if (habits.length > 0) {
                    const dots = document.createElement('div');
                    dots.className = 'habit-dots';
                    
                    habits.forEach(habit => {
                        const dot = document.createElement('div');
                        dot.className = `habit-dot ${habit}`;
                        dot.title = HABIT_NAMES[habit];
                        dots.appendChild(dot);
                    });
                    
                    dayElement.appendChild(dots);
                }
                
                // Add click listener
                dayElement.addEventListener('click', () => showDayDetail(day, habits));
                grid.appendChild(dayElement);
            }
            
            // 3. Add next month days (to fill the grid)
            const totalCells = grid.children.length - 7;
            const remainingCells = 42 - totalCells; // Max 6 rows * 7 days = 42
            
            for (let day = 1; day <= remainingCells; day++) {
                const dayElement = createDayElement(day, true);
                grid.appendChild(dayElement);
            }
        }

        function createDayElement(day, otherMonth) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            if (otherMonth) dayElement.classList.add('other-month');
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            return dayElement;
        }

        function showDayDetail(day, habits) {
            const popup = document.getElementById('dayDetailPopup');
            const overlay = document.getElementById('popupOverlay');
            const title = document.getElementById('popupTitle');
            const habitsContainer = document.getElementById('popupHabits');
            const dateStr = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            title.textContent = dateStr.replace(currentDate.getDate(), day); // Correct the day number
            habitsContainer.innerHTML = '';
            
            if (habits.length === 0) {
                habitsContainer.innerHTML = '<p class="empty-habits">No habits tracked for this day.</p>';
            } else {
                habits.forEach(habit => {
                    const habitItem = document.createElement('div');
                    habitItem.className = 'popup-habit-item';
                    habitItem.setAttribute('data-habit', habit); // For border styling
                    habitItem.innerHTML = `
                        <div class="popup-habit-dot ${habit}"></div>
                        <div class="popup-habit-info">
                            <div class="popup-habit-name">${HABIT_NAMES[habit]}</div>
                            <div class="popup-habit-status">✓ Completed</div>
                        </div>
                    `;
                    // Interactive element in popup
                    habitItem.addEventListener('click', () => {
                        alert(`Viewing detailed streak/progress for: ${HABIT_NAMES[habit]}`);
                    });
                    habitsContainer.appendChild(habitItem);
                });
            }
            
            popup.classList.add('active');
            overlay.classList.add('active');
        }

        function closeDayDetail() {
            document.getElementById('dayDetailPopup').classList.remove('active');
            document.getElementById('popupOverlay').classList.remove('active');
        }
        
        // --- NEW INTERACTIVITY FUNCTIONS ---
        const searchBtn = document.getElementById('searchBtn');
        const searchPopover = document.getElementById('searchPopover');
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPopover = document.getElementById('notificationPopover');

        function togglePopover(popover, button) {
            const isActive = popover.classList.contains('active');
            
            // Close other popover if open
            if (popover === searchPopover && notificationPopover.classList.contains('active')) {
                notificationPopover.classList.remove('active');
                notificationBtn.classList.remove('active-btn');
            } else if (popover === notificationPopover && searchPopover.classList.contains('active')) {
                searchPopover.classList.remove('active');
                searchBtn.classList.remove('active-btn');
            }
            
            // Toggle current popover
            popover.classList.toggle('active');
            button.classList.toggle('active-btn');

            // Focus on search input when active
            if (popover === searchPopover && popover.classList.contains('active')) {
                document.getElementById('searchInput').focus();
            }
        }
        
        // Function to close popovers when clicking outside
        function closePopovers(event) {
            const isClickInsideSearch = searchPopover.contains(event.target) || searchBtn.contains(event.target);
            const isClickInsideNotif = notificationPopover.contains(event.target) || notificationBtn.contains(event.target);

            if (!isClickInsideSearch) {
                searchPopover.classList.remove('active');
                searchBtn.classList.remove('active-btn');
            }
            if (!isClickInsideNotif) {
                notificationPopover.classList.remove('active');
                notificationBtn.classList.remove('active-btn');
            }
        }


        // --- Event Listeners and Interaction ---

        // Search and Notification Toggles
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePopover(searchPopover, searchBtn);
        });

        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePopover(notificationPopover, notificationBtn);
        });
        
        // Close popovers when clicking anywhere on the document (unless inside a popover/button)
        document.addEventListener('click', (e) => {
            closePopovers(e);
            // Also keep the existing day detail close logic
            if (document.getElementById('popupOverlay').classList.contains('active')) {
                // Do nothing if day detail is open, it has its own overlay/close logic
            } else if (!document.querySelector('.calendar-day').contains(e.target) && !document.getElementById('dayDetailPopup').contains(e.target)) {
                // If clicked outside day details, do nothing here. The existing logic handles the calendar popover.
            }
        });
        
        // Prevent clicking inside the popover from closing it immediately
        searchPopover.addEventListener('click', (e) => e.stopPropagation());
        notificationPopover.addEventListener('click', (e) => e.stopPropagation());
        
        // Search Input Interaction (Simple logging)
        document.getElementById('searchInput').addEventListener('input', function() {
            const query = this.value;
            const resultsDiv = document.querySelector('.search-results');
            if (query.length > 0) {
                resultsDiv.innerHTML = `Searching for: **${query}**...<br>_Simulated search found 3 items._`;
            } else {
                resultsDiv.innerHTML = 'Try searching for "reading" or "December".';
            }
        });
        
        // Month Navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Popup Close
        document.getElementById('closePopup').addEventListener('click', closeDayDetail);
        document.getElementById('popupOverlay').addEventListener('click', closeDayDetail);

        // View Toggle Interaction
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Simulate view change (professional: don't use 'alert' in final app)
                console.log(`Switched to ${this.dataset.view} view.`);
            });
        });

        // Legend Item Interaction (Filter/Highlight)
        document.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('click', function() {
                const habit = this.dataset.habit;
                // Add class to calendar for filtering effect
                document.getElementById('calendarGrid').classList.toggle(`filter-${habit}`);
                this.classList.toggle('active-filter');
                console.log(`Toggling filter for: ${HABIT_NAMES[habit]}`);

                // In a real application, you would re-render or dynamically hide/show dots
                // For this example, we'll keep the alert:
                // alert(`Toggling filter for: ${HABIT_NAMES[habit]}`);
            });
        });

        // Keyboard Accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDayDetail();
                // Also close the popovers on escape
                searchPopover.classList.remove('active');
                searchBtn.classList.remove('active-btn');
                notificationPopover.classList.remove('active');
                notificationBtn.classList.remove('active-btn');
            } else if (e.key === 'ArrowLeft' && !document.getElementById('popupOverlay').classList.contains('active') && !searchPopover.classList.contains('active') && !notificationPopover.classList.contains('active')) {
                document.getElementById('prevMonth').click();
            } else if (e.key === 'ArrowRight' && !document.getElementById('popupOverlay').classList.contains('active') && !searchPopover.classList.contains('active') && !notificationPopover.classList.contains('active')) {
                document.getElementById('nextMonth').click();
            }
        });

        // Initialize App
        updateHeaderDate();
        renderCalendar();
