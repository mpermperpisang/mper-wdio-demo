/**
 * Get the current day of the month (e.g. 1–31)
 * You can add more date utilities here later.
 */
export function getTodayDateNumber() {
    return new Date().getDate();
}

export function getTodayDateFormattedMMDDYYYY() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months: 0-11
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();
    
    return `${mm}/${dd}/${yyyy}`;
}
