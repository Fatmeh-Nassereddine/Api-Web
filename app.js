// Fetch and display events on the Overview Page
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM fully loaded and parsed.');
  const eventContainer = document.getElementById("event-container");
  const searchInput = document.getElementById("search");
  const addEventButton = document.getElementById("add-event");


  // Debugging logs
  console.log("eventContainer:", eventContainer);
  console.log("searchInput:", searchInput);
  console.log("addEventButton:", addEventButton);


  if (!eventContainer) {
    console.error("Element with id 'event-container' not found.");
    return;
  }
  if (!searchInput) {
    console.error("Element with id 'search' not found.");
    return;
  }
  if (!addEventButton) {
    console.error("Element with id 'add-event' not found.");
    return;
  }

  // Show the Add Event button immediately
  addEventButton.style.display = "block";
  console.log("Add Event button is now visible.");

  // Check if data is already in localStorage
  const storedEvents = JSON.parse(localStorage.getItem("eventsData")) || [];

  // Initialize event features
  function initializeEventFeatures(events) {
    console.log("Initializing event features...");
    displayEvents(events);

    // Add search functionality
    searchInput.addEventListener("input", () =>
      displayEvents(filterEvents(events, searchInput.value))
    );

    // Add Event functionality
    addEventButton.addEventListener("click", () => addEvent(events));
  }

  if (storedEvents.length > 0) {
    console.log("Using cached events from localStorage.");
    initializeEventFeatures(storedEvents);
  } else {
    // Fetch events from API
    console.log("Fetching events from API...");
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

  // Add Event Function
  function addEvent(events) {
    const newEvent = {
      id: events.length + 1,
      title: `New Event ${events.length + 1}`,
      body: "This is a newly added event description.",
      date: `2025-01-${events.length + 10}`,
      time: `${10 + (events.length % 12)}:00 AM`,
      location: `Location ${events.length + 1}`,
    };

    events.push(newEvent);
    localStorage.setItem("eventsData", JSON.stringify(events));
    displayEvents(events);
    alert("New event added successfully!");
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

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", () => deleteEvent(event.id)); 

      const viewDetailsButton = document.createElement("button");
      viewDetailsButton.textContent = "View Details";
      viewDetailsButton.addEventListener("click", () => viewDetails(event.id));
      
      eventCard.appendChild(deleteButton);
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

  // Delete Event Function
  function deleteEvent(eventID) {
    let events = JSON.parse(localStorage.getItem("eventsData")) || [];
    events = events.filter((event) => event.id !== eventID);
    localStorage.setItem("eventsData", JSON.stringify(events));
    displayEvents(events);
    alert("Event deleted successfully!");
  }

  // Fetch event details by ID and display them
  function viewDetails(eventID) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${eventID}`)
      .then((response) => response.json())
      .then((event) => {
        const enrichedEvent = {
          ...event,
          date: `2025-01-${eventID}`,  
          time: `${10 + (eventID % 12)}:00 AM`, 
          location: `Location ${eventID}`, 
        };

        localStorage.setItem("eventDetails", JSON.stringify(enrichedEvent));
        window.location.href = "event-details.html";
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        alert("Failed to fetch event details.");
      });
  }
});

// Display event details on the details page
if (window.location.pathname.endsWith("event-details.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const eventDetailsContainer = document.getElementById("event-details");
    const eventDetails = JSON.parse(localStorage.getItem("eventDetails"));

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
