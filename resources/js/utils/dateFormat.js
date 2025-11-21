/**
 * Format date to "dd MMM, yyyy" format (e.g., "21 Nov, 2025")
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
};

/**
 * Format date with weekday (e.g., "Thursday, 21 Nov, 2025")
 */
export const formatDateWithDay = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month}, ${year}`;
};

