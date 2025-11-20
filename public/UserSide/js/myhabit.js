
        // Load habits from localStorage
        function loadHabits() {
            const habitsContainer = document.getElementById('habitsContainer');
            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            
            if (habits.length === 0) {
                habitsContainer.innerHTML = `
                    <div class="empty-state">
                        <h3>No habits yet</h3>
                        <p>Click "Add Habit" to create your first habit</p>
                    </div>
                `;
                return;
            }
            
            habitsContainer.innerHTML = '';
            
            habits.forEach(habit => {
                const habitCard = document.createElement('div');
                habitCard.className = `habit-card ${habit.color}`;
                habitCard.innerHTML = `
                    <button class="edit-btn" onclick="editHabit(${habit.id})">Edit</button>
                    
                    <div class="habit-tracker" id="tracker-${habit.id}"></div>

                    <div class="habit-info">
                        <div class="habit-details">
                            <h3>${habit.title}</h3>
                            <p>${habit.description}</p>
                        </div>
                        <div class="habit-streak">
                            <div class="streak-number">${habit.streak} day streak 💪</div>
                            ${habit.completedToday ? '<div class="streak-label">Completed today</div>' : ''}
                        </div>
                    </div>

                    <div class="habit-actions">
                        <button class="action-btn add-notes-btn" onclick="addNote(${habit.id})">+ Add Notes</button>
                        <button class="action-btn done-btn" onclick="markDone(${habit.id})">Done</button>
                        <button class="delete-habit-btn" onclick="deleteHabit(${habit.id})">🗑️ Delete</button>
                    </div>
                `;
                
                habitsContainer.appendChild(habitCard);
                
                // Generate tracker for this habit
                generateTracker(`tracker-${habit.id}`, habit.completedDays || []);
            });
        }

        // Generate habit tracker (365 days)
        function generateTracker(trackerId, completedDays = []) {
            const tracker = document.getElementById(trackerId);
            if (!tracker) return;
            
            const totalDays = 365;
            
            for (let i = 0; i < totalDays; i++) {
                const dayBox = document.createElement('div');
                dayBox.className = 'day-box';
                
                if (completedDays.includes(i)) {
                    dayBox.classList.add('completed');
                }
                
                dayBox.addEventListener('click', function() {
                    this.classList.toggle('completed');
                });
                
                tracker.appendChild(dayBox);
            }
        }

        // Delete habit
        function deleteHabit(habitId) {
            if (!confirm('Are you sure you want to delete this habit?')) {
                return;
            }
            
            let habits = JSON.parse(localStorage.getItem('habits') || '[]');
            habits = habits.filter(h => h.id !== habitId);
            localStorage.setItem('habits', JSON.stringify(habits));
            
            loadHabits();
        }

        // Edit habit
        function editHabit(habitId) {
            window.location.href = `myhabitedit.html?id=${habitId}`;
        }

        // Mark as done
        function markDone(habitId) {
            let habits = JSON.parse(localStorage.getItem('habits') || '[]');
            const habit = habits.find(h => h.id === habitId);
            
            if (habit) {
                const today = new Date().toDateString();
                if (!habit.lastCompleted || habit.lastCompleted !== today) {
                    habit.streak = (habit.streak || 0) + 1  ;
                    habit.lastCompleted = today;
                    habit.completedToday = true;
                    
                    if (!habit.completedDays) habit.completedDays = [];
                    habit.completedDays.push(habit.completedDays.length);
                    
                    localStorage.setItem('habits', JSON.stringify(habits));
                    loadHabits();
                    alert('Habit marked as done! 🎉');
                } else {
                    alert('Already completed today!');
                }
            }
        }

        // Add note
        function addNote(habitId) {
            const note = prompt('Add a note for this habit:');
            if (note) {
                let habits = JSON.parse(localStorage.getItem('habits') || '[]');
                const habit = habits.find(h => h.id === habitId);
                
                if (habit) {
                    if (!habit.notes) habit.notes = [];
                    habit.notes.push({
                        text: note,
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('habits', JSON.stringify(habits));
                    alert('Note added successfully!');
                }
            }
        }

        // Load habits when page loads
        document.addEventListener('DOMContentLoaded', function() {
            loadHabits();
            
            // Set current date
            const dateText = document.querySelector('.date-text');
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateText.textContent = new Date().toLocaleDateString('en-US', options);
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchIcon = document.getElementById('search-icon');

        searchIcon.addEventListener('click', () => {
            const isHidden = searchInput.style.display === 'none' || searchInput.style.display === '';
            searchInput.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            
            if (searchTerm) {
                const filtered = habits.filter(h => 
                    h.title.toLowerCase().includes(searchTerm) || 
                    h.description.toLowerCase().includes(searchTerm)
                );
                console.log('Filtered habits:', filtered);
            } else {
                loadHabits();
            }
        });