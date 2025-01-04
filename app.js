// Fetch and display events on the Overview Page
document.addEventListener("DOMContentLoaded", () => {
    const eventContainer = document.getElementById("event-container");
    const searchInput = document.getElementById("search");

    // Debugging logs
  console.log("eventContainer:", eventContainer);
  console.log("searchInput:", searchInput);

  if (!eventContainer) {
    console.error("Element with id 'event-container' not found.");
    return;
  }
  if (!searchInput) {
    console.error("Element with id 'search' not found.");
    return;
  }
  
    // Fetch events from API
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        displayEvents(data);
        searchInput.addEventListener("input", () =>
          displayEvents(filterEvents(data, searchInput.value))
        );
      });

    // Display events in the container
    function displayEvents(events) {
      eventContainer.innerHTML = "";
      events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";
        eventCard.innerHTML = `
          <h3>${event.title}</h3>
          <p>${event.body.substring(0, 50)}...</p>
          <button onclick="viewDetails(${event.id})">View Details</button>
        `;
        eventContainer.appendChild(eventCard);
      });
    }
  
    // Filter events based on search query
    function filterEvents(events, query) {
      return events.filter((event) =>
        event.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  });
  
  // Navigate to details page
  function viewDetails(id) {
    localStorage.setItem("eventId", id);
    window.location.href = "event-details.html";
  }
  
  
  // Display details on the Details Page
  if (window.location.pathname.endsWith("event-details.html")) {
    document.addEventListener("DOMContentLoaded", () => {
      const eventId = localStorage.getItem("eventId");
      const eventDetailsContainer = document.getElementById("event-details");

      // Debugging log for Event-Details Page
    console.log("eventDetailsContainer:", eventDetailsContainer);
    console.log("eventId from localStorage:", eventId);

    if (!eventDetailsContainer) {
      console.error("Element with id 'event-details' not found.");
      return;
    }
    if (!eventId) {
      console.error("eventId not found in localStorage.");
      return;
    }

  
      fetch(`https://jsonplaceholder.typicode.com/posts/${eventId}`)
        .then((response) => response.json())
        .then((event) => {
          eventDetailsContainer.innerHTML = `
            <h2>${event.title}</h2>
            <p>${event.body}</p>
          `;
        });
    });
  }

document.addEventListener("DOMContentLoaded", () => {
  
    const savedTheme = localStorage.getItem("theme") || "light";
  
   
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
  
   
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
    
      const isDarkMode = document.body.classList.toggle("dark-mode");
  
     
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  });
  