// Helper function to format time ago
const timeAgo = (timestamp) => {
    const now = new Date();
    const timeDiff = Math.floor((now - new Date(timestamp)) / 1000); // Difference in seconds
  
    const units = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];
  
    for (const unit of units) {
      const interval = Math.floor(timeDiff / unit.seconds);
      if (interval >= 1) {
        return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };


export default timeAgo;  