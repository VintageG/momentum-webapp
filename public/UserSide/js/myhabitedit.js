
        let currentHabitId = null;

        // Get habit ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        currentHabitId = parseInt(urlParams.get('id'));

        // Load habit data
        function loadHabitData() {
            if (!currentHabitId) {
                alert('No habit selected');
                window.location.href = 'myhabit.html';
                return;
            }

            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            const habit = habits.find(h => h.id === currentHabitId);

            if (!habit) {
                alert('Habit not found');
                window.location.href = 'myhabit.html';
                return;
            }

            // Fill form with habit data
            document.getElementById('habitTitle').value = habit.title;
            document.getElementById('habitDesc').value = habit.description;
            document.getElementById('notifToggle').checked = habit.notification;
            
            // Set active days
            document.querySelectorAll('.day-circle').forEach(circle => {
                const day = circle.getAttribute('data-day');
                if (habit.days && habit.days.includes(day)) {
                    circle.classList.remove('inactive');
                    circle.classList.add('active');
                } else {
                    circle.classList.remove('active');
                    circle.classList.add('inactive');
                }
            });
            updateDaysCount();

            // Load notes
            renderNotes(habit.notes);

            // Update stats
            document.getElementById('currentStreak').textContent = habit.streak || 0;
            const completedDaysCount = habit.completedDays ? habit.completedDays.length : 0;
            document.getElementById('totalDays').textContent = completedDaysCount;

            // Simple Success Rate Calculation (Placeholder)
            const totalDaysSinceCreation = Math.ceil((new Date() - new Date(habit.createdDate || Date.now())) / (1000 * 60 * 60 * 24)) || 1;
            const successRate = totalDaysSinceCreation > 0 ? Math.round((completedDaysCount / totalDaysSinceCreation) * 100) : 0;
            document.querySelector('.stat-value.purple').textContent = `${successRate}%`;
        }

        // Day selector toggle
        document.querySelectorAll('.day-circle').forEach(day => {
            day.addEventListener('click', function() {
                this.classList.toggle('active');
                this.classList.toggle('inactive');
                updateDaysCount();
            });
        });

        function updateDaysCount() {
            const activeDays = document.querySelectorAll('.day-circle.active').length;
            document.querySelector('.days-info').textContent = `${activeDays} days per week`;
        }
        
        // Render Notes Helper
        function renderNotes(notes = []) {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            
            notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

            notes.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.setAttribute('data-timestamp', note.timestamp);
                noteItem.innerHTML = `
                    <div class="note-text">${note.text}</div>
                    <div class="note-footer">
                        <div class="note-time">${note.time}</div>
                        <div class="note-actions">
                            <button class="delete-note-btn" onclick="deleteNoteFromDOM(this)">🗑️</button>
                        </div>
                    </div>
                `;
                notesList.appendChild(noteItem);
            });
        }
        
        // Delete note function (from DOM)
        function deleteNoteFromDOM(btn) {
            if (confirm('Delete this note? This will be permanent once you save changes.')) {
                btn.closest('.note-item').remove();
            }
        }

        // Add note functionality
        const addNoteBtn = document.getElementById('addNoteBtn');
        const noteInputArea = document.getElementById('noteInputArea');
        const saveNoteBtn = document.getElementById('saveNoteBtn');
        const noteInput = document.getElementById('noteInput');

        addNoteBtn.addEventListener('click', function() {
            noteInputArea.style.display = noteInputArea.style.display === 'none' ? 'block' : 'none';
            if (noteInputArea.style.display === 'block') {
                noteInput.focus();
            }
        });

        saveNoteBtn.addEventListener('click', function() {
            const noteText = noteInput.value.trim();
            if (noteText) {
                const now = new Date();
                const timeStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' at ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                const timestamp = now.toISOString();

                const newNoteItem = document.createElement('div');
                newNoteItem.className = 'note-item';
                newNoteItem.setAttribute('data-timestamp', timestamp);
                newNoteItem.innerHTML = `
                    <div class="note-text">${noteText}</div>
                    <div class="note-footer">
                        <div class="note-time">${timeStr}</div>
                        <div class="note-actions">
                            <button class="delete-note-btn" onclick="deleteNoteFromDOM(this)">🗑️</button>
                        </div>
                    </div>
                `;
                
                document.getElementById('notesList').insertBefore(newNoteItem, document.getElementById('notesList').firstChild);
                noteInput.value = '';
                noteInputArea.style.display = 'none';
            }
        });

        // Save Changes Function (Fulfills primary user requirement)
        function saveChanges() {
            const habitTitle = document.getElementById('habitTitle').value.trim();
            const habitDesc = document.getElementById('habitDesc').value.trim();
            const notification = document.getElementById('notifToggle').checked;
            
            if (!habitTitle) {
                alert('Habit title cannot be empty.');
                return;
            }

            // Get selected days
            const selectedDays = Array.from(document.querySelectorAll('.day-circle.active'))
                .map(circle => circle.getAttribute('data-day'));

            // Get all current notes from the DOM
            const currentNotes = Array.from(document.querySelectorAll('#notesList .note-item')).map(item => {
                return {
                    text: item.querySelector('.note-text').textContent,
                    time: item.querySelector('.note-time').textContent,
                    timestamp: item.getAttribute('data-timestamp') || new Date().toISOString()
                };
            });

            const habits = JSON.parse(localStorage.getItem('habits') || '[]');
            const habitIndex = habits.findIndex(h => h.id === currentHabitId);

            if (habitIndex > -1) {
                habits[habitIndex].title = habitTitle;
                habits[habitIndex].description = habitDesc;
                habits[habitIndex].notification = notification;
                habits[habitIndex].days = selectedDays;
                habits[habitIndex].notes = currentNotes;
                
                localStorage.setItem('habits', JSON.stringify(habits));
                alert('Habit updated successfully!');
                // Redirect back to myhabit dashboard
                window.location.href = 'myhabit.html'; 
            } else {
                alert('Error: Habit not found in storage.');
            }
        }

        // Event listener for the Save Changes button
        document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);

        // Delete Habit Functionality (Fulfills implicit requirement for a delete button)
        document.getElementById('deleteBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
                const habits = JSON.parse(localStorage.getItem('habits') || '[]');
                const newHabits = habits.filter(h => h.id !== currentHabitId);
                
                localStorage.setItem('habits', JSON.stringify(newHabits));
                alert('Habit deleted successfully!');
                // Redirect back to myhabit dashboard
                window.location.href = 'myhabit.html'; 
            }
        });

        // Function to set the current date in the header
        function setCurrentDate() {
            const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', dateOptions);
        }

        // Initialize page functions on load
        document.addEventListener('DOMContentLoaded', () => {
            setCurrentDate();
            loadHabitData();
        });

        // Expose function to global scope for use in inline HTML `onclick`
        window.deleteNoteFromDOM = deleteNoteFromDOM;