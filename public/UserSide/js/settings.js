
        // Data for search function
        const searchItems = [
            { title: "Two-Factor Authentication", category: "Privacy Settings", screen: "privacy-screen" },
            { title: "Session Management", category: "Privacy Settings", screen: "privacy-screen" },
            { title: "Dark Mode", category: "Profile Preferences", screen: "profile-screen" },
            { title: "Start of Week", category: "Profile Preferences", screen: "profile-screen" },
            { title: "Change Password", category: "Profile Preferences", screen: "profile-screen" },
            { title: "Push Notifications", category: "Notification Settings", screen: "notifications-screen" },
            { title: "Daily Reminders", category: "Notification Settings", screen: "notifications-screen" },
            { title: "Streak Celebrations", category: "Notification Settings", screen: "notifications-screen" },
            { title: "Global Reminder Time", category: "Notification Timing", screen: "notifications-screen" },
            { title: "Quiet Hours", category: "Notification Timing", screen: "notifications-screen" },
            { title: "Export Data", category: "Danger Zone", screen: "profile-screen" },
            { title: "Delete Account", category: "Danger Zone", screen: "profile-screen" },
            { title: "First Name", category: "Profile Information", screen: "profile-screen" },
            { title: "Email", category: "Profile Information", screen: "profile-screen" },
        ];

        function showScreen(screenId, tabElement) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');

            // Update tab active state based on the clicked tab's parent screen
            const activeTabContainer = document.querySelector(`#${screenId}`).querySelector('.tabs');
            if (activeTabContainer) {
                activeTabContainer.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                if (tabElement) {
                    tabElement.classList.add('active');
                }
            }
        }

        function toggleSwitch(element) {
            element.classList.toggle('active');
        }

        function changePassword() {
            alert('Password changed successfully!');
            showScreen('profile-screen', document.querySelector('.tabs .tab[data-screen=\'profile-screen\']'));
        }

        // ====================== NEW JAVASCRIPT FOR SEARCH ======================

        function toggleSearch(show) {
            const overlay = document.getElementById('search-overlay');
            const input = document.getElementById('search-input');
            if (show) {
                overlay.classList.add('active');
                input.focus();
                filterResults(); // Show initial prompt
            } else {
                overlay.classList.remove('active');
                input.value = '';
                document.getElementById('search-results').innerHTML = '<p>Start typing to see results...</p>';
            }
        }

        function filterResults() {
            const query = document.getElementById('search-input').value.toLowerCase();
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';

            if (query.length < 2) {
                resultsContainer.innerHTML = '<p>Keep typing for more refined results...</p>';
                return;
            }

            const filtered = searchItems.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                resultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
            } else {
                filtered.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('search-result-item');
                    resultItem.innerHTML = `
                        <div class="result-title">${item.title}</div>
                        <div class="result-subtitle">Jump to: ${item.category}</div>
                    `;
                    // Add click event to navigate to the item's screen
                    resultItem.onclick = () => jumpToSetting(item.screen, item.title);
                    resultsContainer.appendChild(resultItem);
                });
            }
        }
        
        function jumpToSetting(screenId, settingTitle) {
            // 1. Close the search bar
            toggleSearch(false);
            
            // 2. Switch to the target screen
            const targetTab = document.querySelector(`.tabs .tab[data-screen='${screenId}']`);
            showScreen(screenId, targetTab);
            
            // 3. Simple visual feedback (optional, but helpful)
            alert(`Mapsd to the '${settingTitle}' section on the ${screenId.replace('-screen', '')} tab.`);
            
            // In a real application, you would scroll the page to the specific element
            // Example: document.getElementById(screenId).querySelector('h3:contains("'+settingTitle+'")').scrollIntoView();
        }

        // ====================== NEW JAVASCRIPT FOR NOTIFICATIONS ======================

        function toggleNotifications(show) {
            const panel = document.getElementById('notification-panel');
            const notificationBtn = document.querySelector('.icon-btn.has-notifications');
            if (show) {
                panel.classList.add('active');
                // Optional: Remove 'unread' class/badge when opening
                notificationBtn.classList.remove('has-notifications');
            } else {
                panel.classList.remove('active');
            }
        }
        
        // Close notification panel if clicking outside (simple method)
        document.addEventListener('click', (event) => {
            const panel = document.getElementById('notification-panel');
            const bellButton = document.querySelector('.icon-btn.has-notifications') || document.querySelector('.icon-btn[onclick="toggleNotifications(true)"]');
            
            const isClickInsidePanel = panel.contains(event.target);
            const isClickOnBell = bellButton.contains(event.target);
            const isCloseButton = event.target.closest('.icon-btn') === panel.querySelector('.icon-btn');

            if (panel.classList.contains('active') && !isClickInsidePanel && !isClickOnBell && !isCloseButton) {
                toggleNotifications(false);
            }
        });
