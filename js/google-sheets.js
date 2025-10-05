// Google Sheets Integration for Players List
class GoogleSheetsManager {
    constructor(sheetId) {
        this.sheetId = sheetId;
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        this.csvUrlAlt = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    }

    async getSheetData() {
        try {
            console.log('Fetching data from Google Sheets...');
            console.log('CSV URL:', this.csvUrl);
            let response = await fetch(this.csvUrl);
            
            if (!response.ok) {
                console.log('First URL failed, trying alternative...');
                console.log('Alternative CSV URL:', this.csvUrlAlt);
                response = await fetch(this.csvUrlAlt);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            
            const csvText = await response.text();
            console.log('CSV Response:', csvText.substring(0, 200) + '...');
            const data = this.parseCSV(csvText);
            console.log('Parsed data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            return [];
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length > 0 && values[0]) { // Skip empty rows
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
                });
                data.push(obj);
            }
        }
        
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    formatPlayerData(sheetData) {
        console.log('Raw sheet data:', sheetData);
        console.log('First row headers:', sheetData.length > 0 ? Object.keys(sheetData[0]) : 'No data');
        
        return sheetData.map((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);
            
            // Try different possible field names for team name
            const teamName = row['Team name'] || 
                           row['Team name (optional)'] || 
                           row['team name'] || 
                           row['Team Name'] || 
                           'Unnamed Team';
            
            return {
                teamNumber: index + 1,
                teamName: teamName,
                player1Name: row['Player 1 Name'] || row['player 1 name'] || 'Not provided',
                player2Name: row['Player 2 Name'] || row['player 2 name'] || 'Not provided',
                email: row['Email'] || row['email'] || 'Not provided',
                phone: row['Phone number'] || row['phone number'] || 'Not provided',
                paymentType: row['Select payment type'] || row['select payment type'] || 'Not specified',
                paymentProof: row['Upload image of proof of payment'] || row['upload image of proof of payment'] || 'Not uploaded',
                registrationTime: row['Timestamp'] || row['timestamp'] || row['Отметка времени'] || 'Unknown'
            };
        });
    }
}

// Initialize Google Sheets Manager
const sheetsManager = new GoogleSheetsManager('11IgLKADl_f77Kj2cUcXHPUGaRZUPoVSuHsNsv6vQmxE');

// Function to update players from Google Sheets
async function updatePlayersFromGoogleSheets() {
    try {
        console.log('Updating players from Google Sheets...');
        const sheetData = await sheetsManager.getSheetData();
        console.log('Raw sheet data:', sheetData);
        
        const players = sheetsManager.formatPlayerData(sheetData);
        console.log('Formatted players:', players);
        
        // Update statistics
        console.log('Calling updateStatistics with', players.length, 'players');
        updateStatistics(players);
        
        // Display players
        displayPlayers(players);
        
        // Update last updated time
        updateLastUpdatedTime();
        
        console.log('Players updated successfully:', players.length);
        return players;
    } catch (error) {
        console.error('Failed to update players:', error);
        showErrorState('Failed to load players from Google Sheets. Please check the connection.');
        return [];
    }
}

// Function to update statistics
function updateStatistics(players) {
    console.log('Updating statistics with', players.length, 'players');
    const totalTeams = players.length;
    const totalPlayers = totalTeams * 2;
    const maxTeams = 16;
    const spotsLeft = Math.max(0, maxTeams - totalTeams);
    
    updateStatElement('total-teams', totalTeams);
    updateStatElement('total-players', totalPlayers);
    updateStatElement('spots-left', spotsLeft);
    
    console.log('Statistics updated:', { totalTeams, totalPlayers, spotsLeft });
}

// Function to update individual stat element
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    console.log(`Updating ${elementId}:`, element ? 'found' : 'not found', 'value:', value);
    
    if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        console.log(`Current value for ${elementId}:`, currentValue, 'New value:', value);
        animateNumber(element, currentValue, value);
    } else {
        console.error(`Element with ID '${elementId}' not found!`);
    }
}

// Function to animate number change
function animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.round(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Function to display players
function displayPlayers(players) {
    const container = document.getElementById('players-container');
    if (!container) return;
    
    if (players.length === 0) {
        showNoPlayersState();
        return;
    }
    
    const playersGrid = document.createElement('div');
    playersGrid.className = 'players-grid';
    
    players.forEach((player, index) => {
        const teamCard = createTeamCard(player, index + 1);
        playersGrid.appendChild(teamCard);
    });
    
    container.innerHTML = '';
    container.appendChild(playersGrid);
}

// Function to create team card
function createTeamCard(player, teamNumber) {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    card.innerHTML = `
        <div class="team-header">
            <div class="team-name"><strong>Team Name:</strong> ${player.teamName}</div>
            <div class="team-number">#${teamNumber}</div>
        </div>
        
        <div class="player-info">
            <h4>Player 1</h4>
            <p><strong>Name:</strong> ${player.player1Name}</p>
        </div>
        
        <div class="player-info">
            <h4>Player 2</h4>
            <p><strong>Name:</strong> ${player.player2Name}</p>
        </div>
        
        <div class="contact-info">
            <h4>Contact Information</h4>
            <p><strong>Email:</strong> ${player.email}</p>
            <p><strong>Phone:</strong> ${player.phone}</p>
        </div>
        
        <div class="payment-info">
            <h4>Payment Information</h4>
            <p><strong>Payment Method:</strong> ${player.paymentType}</p>
            ${player.paymentProof !== 'Not uploaded' ? `
                <p><strong>Payment Proof:</strong> <a href="${player.paymentProof}" target="_blank">View</a></p>
            ` : '<p><strong>Payment Proof:</strong> Not uploaded</p>'}
        </div>
        
        <div class="registration-time">
            <p><strong>Registered:</strong> ${formatRegistrationTime(player.registrationTime)}</p>
        </div>
    `;
    
    return card;
}

// Function to show no players state
function showNoPlayersState() {
    const container = document.getElementById('players-container');
    if (container) {
        container.innerHTML = `
            <div class="no-players">
                <h4>No Teams Registered Yet</h4>
                <p>Be the first to register for THE KING OF SPADES Tournament!</p>
                <p>Limited spots available - only 16 teams can participate.</p>
                <a href="register.html" class="register-btn">Register Your Team</a>
            </div>
        `;
    }
}

// Function to show error state
function showErrorState(message) {
    const container = document.getElementById('players-container');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <h4>Error</h4>
                <p>${message}</p>
                <button class="retry-btn" onclick="updatePlayersFromGoogleSheets()">Retry</button>
            </div>
        `;
    }
}

// Function to format registration time
function formatRegistrationTime(timestamp) {
    if (!timestamp || timestamp === 'Unknown') return 'Unknown';
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return timestamp; // Return original if can't parse
        
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return timestamp;
    }
}

// Function to update last updated time
function updateLastUpdatedTime() {
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = 'Last updated: ' + new Date().toLocaleString();
    }
}

// Function to refresh players (called by button)
function refreshPlayers() {
    console.log('Manual refresh triggered');
    updatePlayersFromGoogleSheets();
}

// Auto-refresh every 30 seconds
let refreshInterval;
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        console.log('Auto-refreshing players data...');
        updatePlayersFromGoogleSheets();
    }, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Function to force update statistics (for initial load)
function forceUpdateStatistics() {
    console.log('Force updating statistics...');
    
    // Try to get current data
    updatePlayersFromGoogleSheets().then(players => {
        console.log('Force update completed with', players.length, 'players');
    }).catch(error => {
        console.error('Force update failed:', error);
        // Set default values if update fails
        updateStatElement('total-teams', 0);
        updateStatElement('total-players', 0);
        updateStatElement('spots-left', 16);
    });
}

// Export functions for global access
window.updatePlayersFromGoogleSheets = updatePlayersFromGoogleSheets;
window.refreshPlayers = refreshPlayers;
window.startAutoRefresh = startAutoRefresh;
window.stopAutoRefresh = stopAutoRefresh;
window.forceUpdateStatistics = forceUpdateStatistics;
