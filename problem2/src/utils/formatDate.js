const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Define months array for month names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Get the month, day, year, hours, and minutes from the Date object
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Format the date string
    const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}`;
  
    return formattedDate;
};

export default formatDate;