
        // Set current date
        const now = new Date(2025, 10, 10);
        const dateText = document.querySelector('.date-text');
        dateText.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        // Monthly calendar
        let currentDate = new Date(2025, 10, 1  ); // November 2025

        function generateMonthlyCalendar() {
            const grid = document.querySelector('.calendar-grid');
            grid.innerHTML = '';
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonthVal = new Date(year, month + 1, 0).getDate();
            const prevDays = new Date(year, month, 0).getDate();

            // Previous month days
            for (let i = firstDay - 1; i >= 0; i--) {
                const div = document.createElement('div');
                div.className = 'calendar-date other-month';
                div.textContent = prevDays - i;
                grid.appendChild(div);
            }

            // Current month days
            for (let d = 1; d <= daysInMonthVal; d++) {
                const div = document.createElement('div');
                div.className = 'calendar-date';
                div.textContent = d;
                div.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                // Check if today
                if (year === now.getFullYear() && month === now.getMonth() && d === now.getDate()) {
                    div.classList.add('today');
                }

                // Set completed for days before today
                if (d < now.getDate()) {
                    div.classList.add('completed');
                }

                grid.appendChild(div);
            }

            // Next month days to fill grid
            let totalCells = grid.children.length;
            while (totalCells < 42) {
                const d = totalCells - (firstDay + daysInMonthVal) + 1;
                const div = document.createElement('div');
                div.className = 'calendar-date other-month';
                div.textContent = d;
                grid.appendChild(div);
                totalCells++;
            }

            // Update title
            document.querySelector('.monthly-calendar .card-title').textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + year;
        }

        generateMonthlyCalendar();

        // Navigation buttons
        const navButtons = document.querySelectorAll('.calendar-nav button');
        navButtons[0].addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateMonthlyCalendar();
        });
        navButtons[1].addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateMonthlyCalendar();
        });

        // Toggle completed on click
        document.querySelector('.calendar-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-date') && !e.target.classList.contains('other-month')) {
                e.target.classList.toggle('completed');
            }
        });

        // Generate year calendar
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        months.forEach((month, idx) => {
            const container = document.getElementById(month);
            let html = '';
            
            for (let i = 0; i < daysInMonth[idx]; i++) {
                const dayDate = new Date(2025, idx, i + 1);
                let className = 'day-cell';
                
                if (dayDate <= now) {
                    const rand = Math.random();
                    if (rand > 0.7) className += ' dark';
                    else if (rand > 0.4) className += ' medium';
                    else if (rand > 0.1) className += ' light';
                }
                
                html += `<div class="${className}"></div>`;
            }
            
            container.innerHTML = html;
        });

        // Make year months clickable to switch monthly view
        document.querySelectorAll('.month-mini').forEach((monthEl, idx) => {
            monthEl.addEventListener('click', () => {
                currentDate.setMonth(idx);
                generateMonthlyCalendar();
            });
        });

        // Add interactivity to habits
        document.querySelectorAll('.habit-item').forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('completed');
                const checkbox = this.querySelector('.habit-checkbox');
                const action = this.querySelector('.habit-action');
                
                if (this.classList.contains('completed')) {
                    checkbox.innerHTML = '✓';
                    action.textContent = 'Completed';
                } else {
                    checkbox.innerHTML = '';
                    action.textContent = 'Mark Done';
                }
            });
        });

        // Save note functionality
        document.querySelector('.save-btn').addEventListener('click', function() {
            const input = document.querySelector('.note-input');
            if (input.value.trim()) {
                const notesList = document.querySelector('.notes-list');
                const timeNow = new Date();
                const timeStr = `Today at ${timeNow.getHours()}:${String(timeNow.getMinutes()).padStart(2, '0')} ${timeNow.getHours() >= 12 ? 'PM' : 'AM'}`;
                
                const newNote = document.createElement('div');
                newNote.className = 'note-item';
                newNote.innerHTML = `
                    <div class="note-text">${input.value}</div>
                    <div class="note-footer">
                        <div class="note-time">${timeStr}</div>
                        <div class="note-actions">
                            <button>✏️</button>
                            <button>🗑️</button>
                        </div>
                    </div>
                `;
                
                notesList.insertBefore(newNote, notesList.firstChild);
                input.value = '';
            }
        });

        // Delete note functionality
        document.addEventListener('click', function(e) {
            if (e.target.textContent === '🗑️') {
                const noteItem = e.target.closest('.note-item');
                if (noteItem && confirm('Delete this note?')) {
                    noteItem.remove();
                }
            }
        });

        // Search bar interactivity
        const searchIcon = document.getElementById('search-icon');
        const searchInput = document.querySelector('.search-input');
        searchIcon.addEventListener('click', () => {
            searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
            if (searchInput.style.display === 'block') {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('Searching for: ' + searchInput.value);
                // Here you can add search logic
                searchInput.value = '';
                searchInput.style.display = 'none';
            }
        });

        // Notifications interactivity
        const notifyIcon = document.getElementById('notify-icon');
        const notifications = document.getElementById('notifications');
        notifyIcon.addEventListener('click', () => {
            notifications.style.display = notifications.style.display === 'none' ? 'block' : 'none';
        });

        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.add('read');
            });
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!notifyIcon.contains(e.target) && !notifications.contains(e.target)) {
                notifications.style.display = 'none';
            }
            if (!searchIcon.contains(e.target) && !searchInput.contains(e.target)) {
                searchInput.style.display = 'none';
            }
        });