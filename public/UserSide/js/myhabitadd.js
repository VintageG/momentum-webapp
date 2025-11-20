
        // Store notes temporarily
        let tempNotes = [];

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

        // Add note functionality
        const addNoteBtn = document.getElementById('addNoteBtn');
        const noteInputArea = document.getElementById('noteInputArea');
        const saveNoteBtn = document.getElementById('saveNoteBtn');
        const noteInput = document.getElementById('noteInput');
        const notesList = document.getElementById('notesList');

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
                const timeStr = `Today at ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
                
                const noteData = {
                    text: noteText,
                    time: timeStr,
                    timestamp: now.toISOString()
                };
                
                tempNotes.push(noteData);
                
                const newNote = document.createElement('div');
                newNote.className = 'note-item';
                newNote.innerHTML = `
                    <div class="note-text">${noteText}</div>
                    <div class="note-footer">
                        <div class="note-time">${timeStr}</div>
                        <div class="note-actions">
                            <button class="delete-note-btn" onclick="deleteNote(this)">🗑️</button>
                        </div>
                    </div>
                `;
                
                notesList.insertBefore(newNote, notesList.firstChild);
                noteInput.value = '';
                noteInputArea.style.display = 'none';
            }
        });

        // Delete note function
        function deleteNote(btn) {
            if (confirm('Delete this note?')) {
                const noteItem = btn.closest('.note-item');
                const noteText = noteItem.querySelector('.note-text').textContent;
                tempNotes = tempNotes.filter(n => n.text !== noteText);
                noteItem.remove();
            }
        }

        // Add habit when button is clicked
        document.getElementById('addHabitBtn').addEventListener('click', function() {
            const habitTitle = document.getElementById('habitTitle').value.trim();
            const habitDesc = document.getElementById('habitDesc').value.trim();
            const notifEnabled = document.getElementById('notifToggle').checked;
            
            if (!habitTitle) {
                alert('Please enter a habit title');
                return;
            }
            
            // Get existing habits or create empty array
            let habits = JSON.parse(localStorage.getItem('habits') || '[]');
            
            // Get selected days
            const selectedDays = [];
            document.querySelectorAll('.day-circle.active').forEach(day => {
                selectedDays.push(day.getAttribute('data-day'));
            });
            
            // Create new habit object
            const newHabit = {
                id: Date.now(),
                title: habitTitle,
                description: habitDesc || 'No description provided',
                notification: notifEnabled,
                days: selectedDays,
                streak: 0,
                completedDays: [],
                notes: tempNotes,
                color: ['green', 'yellow', 'blue', 'pink'][Math.floor(Math.random() * 4)],
                createdAt: new Date().toISOString()
            };
            
            // Add to habits array
            habits.push(newHabit);
            
            // Save to localStorage
            localStorage.setItem('habits', JSON.stringify(habits));
            
            // Show success message
            this.textContent = 'Adding Habit...';
            this.style.background = '#4caf50';
            
            setTimeout(() => {
                this.textContent = 'Habit Added ✓';
                setTimeout(() => {
                    // Redirect to myhabit.html
                    window.location.href = 'myhabit.html';
                }, 1000);
            }, 500);
        });

        // Set current date
        const dateText = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateText.textContent = new Date().toLocaleDateString('en-US', options);

        // Enter key to save note
        noteInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                saveNoteBtn.click();
            }
        });