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

  // Check if data is already in localStorage
  const storedEvents = JSON.parse(localStorage.getItem("eventsData"));

  if (storedEvents) {
    // Use cached data
    console.log("Using cached events from localStorage.");
    initializeEventFeatures(storedEvents);
  } else {
    // Fetch events from API
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        const enrichedData = data.map((event, index) => ({
          ...event,
          date: `2025-01-${10 + index}`, 
          time: `${10 + (index % 12)}:00 AM`, 
          location: `Location ${index + 1}`, 
        }));

        // Store enriched data in localStorage
        localStorage.setItem("eventsData", JSON.stringify(enrichedData));
        initializeEventFeatures(enrichedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Initialize event features
  function initializeEventFeatures(events) {
    displayEvents(events);

    // Add search functionality
    searchInput.addEventListener("input", () =>
      displayEvents(filterEvents(events, searchInput.value))
    );
  }

  // Display events in the container
  function displayEvents(events) {
    eventContainer.innerHTML = "";
    if (events.length === 0) {
      eventContainer.innerHTML = "<p>No events found.</p>";
      return;
    }
    events.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.className = "event-card";
      eventCard.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.body.substring(0, 50)}...</p>
        `;
      const viewDetailsButton = document.createElement("button");
      viewDetailsButton.textContent = "View Details";
      viewDetailsButton.addEventListener("click", () => viewDetails(event.id));
      eventCard.appendChild(viewDetailsButton);
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

// Fetch event details by ID and display them
function viewDetails(eventID) {
  // Fetch event details by EventID
  fetch(`https://jsonplaceholder.typicode.com/posts/${eventID}`)
    .then((response) => response.json())
    .then((event) => {
      const enrichedEvent = {
        ...event,
        date: `2025-01-${eventID}`,  
        time: `${10 + (eventID % 12)}:00 AM`, 
        location: `Location ${eventID}`, 
      };

      // Save event details to localStorage and navigate to the details page
      localStorage.setItem("eventDetails", JSON.stringify(enrichedEvent));
      window.location.href = "event-details.html";
    })
    .catch((error) => {
      console.error("Error fetching event details:", error);
      alert("Failed to fetch event details.");
    });
}

// Display event details on the details page
if (window.location.pathname.endsWith("event-details.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const eventDetailsContainer = document.getElementById("event-details");
    const eventDetails = JSON.parse(localStorage.getItem("eventDetails"));

    // Debugging logs
    console.log("eventDetailsContainer:", eventDetailsContainer);
    console.log("eventDetails from localStorage:", eventDetails);

    if (!eventDetailsContainer || !eventDetails) {
      console.error("Missing event details or container.");
      eventDetailsContainer.innerHTML =
        "<p>Event details could not be loaded.</p>";
      return;
    }

    // Populate event details
    eventDetailsContainer.innerHTML = `
      <h2>${eventDetails.title}</h2>
      <p>${eventDetails.body}</p>
      <p><strong>Date:</strong> ${eventDetails.date}</p>
      <p><strong>Time:</strong> ${eventDetails.time}</p>
      <p><strong>Location:</strong> ${eventDetails.location}</p>
    `;
  });
}

// Theme toggle logic
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-mode", savedTheme === "dark");

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDarkMode = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  }
});
