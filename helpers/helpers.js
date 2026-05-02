const helpers = {
  eq: (a, b) => a === b,

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTimeLocal: (dateString) => {
    const date = new Date(dateString);

    const pad = (num) => String(num).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },

  safetyLetter: (rating) => {
    if (rating < 5) return 'A';
    if (rating < 10) return 'B';
    if (rating < 20) return 'C';
    return 'F';
  },
  
  safetyClass: (rating) => {
    if (rating < 5) return 'safety-a';
    if (rating < 10) return 'safety-b';
    if (rating < 20) return 'safety-c';
    return 'safety-d';
  }
};

export default helpers;