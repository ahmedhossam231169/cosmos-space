" use strict ";
// Select navigation buttons and content sections
const todayInSpaceBtn = document.querySelector("[data-section='today-in-space']");
const launchesBtn = document.querySelector("[data-section='launches']");
const planetsBtn = document.querySelector("[data-section='planets']");
const toggleBtn = document.querySelector("#sidebar-toggle");
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const navLinks = document.querySelectorAll(".nav-link");
let plantsLength = null;
let planetsData = [];
const au = 149597870.7;
let dateByCalendar = "";
//select the content containers for each section
const todayInSpaceContent = document.querySelector("#today-in-space");
const launchesContent = document.querySelector("#launches-grid");
const planetsContent = document.querySelector("#planets-content");
const staticImageFallback = "assets/images/launch-placeholder.png"; // Placeholder image for launches and APOD
const FEATURED = document.querySelector(".FEATURED");
const todayInSpaceSection = document.querySelector("#today-in-space");
const launchesSection = document.querySelector("#launches");
const planetsSection = document.querySelector("#planets");
const header = document.querySelector("header");
let planetsGrid = document.querySelector("#planets-grid");
let planetTbody = document.querySelector("#planet-comparison-tbody");
let plantsCardInfo = document.querySelector(`.plants-info`);
let launchLength = 0; // Placeholder for the number of launches until the data is fetched

function toggleSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.toggle("sidebar-open");
  sidebarOverlay.classList.toggle("hidden");
  document.body.classList.toggle("overflow-hidden");
}

function closeSidebarOnMobile() {
  if (window.innerWidth >= 1024 || !sidebar || !sidebarOverlay) return;

  if (sidebar.classList.contains("sidebar-open")) {
    sidebar.classList.remove("sidebar-open");
    sidebarOverlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// Event listeners for navigation buttons
todayInSpaceBtn.addEventListener("click", () => {
  todayInSpaceBtn.classList.add("bg-blue-500/10", "text-blue-400");
  launchesBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  planetsBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  todayInSpaceSection.classList.remove("hidden");
  launchesSection.classList.add("hidden");
  planetsSection.classList.add("hidden");
  closeSidebarOnMobile();
});

launchesBtn.addEventListener("click", () => {
  todayInSpaceBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  launchesBtn.classList.add("bg-blue-500/10", "text-blue-400");
  planetsBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  todayInSpaceSection.classList.add("hidden");
  launchesSection.classList.remove("hidden");
  planetsSection.classList.add("hidden");
  closeSidebarOnMobile();
});

planetsBtn.addEventListener("click", () => {
  todayInSpaceBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  launchesBtn.classList.remove("bg-blue-500/10", "text-blue-400");
  planetsBtn.classList.add("bg-blue-500/10", "text-blue-400");
  todayInSpaceSection.classList.add("hidden");
  launchesSection.classList.add("hidden");
  planetsSection.classList.remove("hidden");
  closeSidebarOnMobile();
});

toggleBtn.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetSection = link.dataset.section;
    const sectionToShow = document.querySelector(`#${targetSection}`);

    if (!sectionToShow) return;

    todayInSpaceBtn.classList.toggle("bg-blue-500/10", targetSection === "today-in-space");
    todayInSpaceBtn.classList.toggle("text-blue-400", targetSection === "today-in-space");
    launchesBtn.classList.toggle("bg-blue-500/10", targetSection === "launches");
    launchesBtn.classList.toggle("text-blue-400", targetSection === "launches");
    planetsBtn.classList.toggle("bg-blue-500/10", targetSection === "planets");
    planetsBtn.classList.toggle("text-blue-400", targetSection === "planets");

    todayInSpaceSection.classList.toggle("hidden", targetSection !== "today-in-space");
    launchesSection.classList.toggle("hidden", targetSection !== "launches");
    planetsSection.classList.toggle("hidden", targetSection !== "planets");

    closeSidebarOnMobile();
  });
});
////////////////////////////////////////////////////////////////////////////////////////////


// Fetch and display data for "Today in Space" section
async function fetchAPODByDate(selectedDate = "") {
  try {
    const apodUrl = selectedDate
      ? `https://api.nasa.gov/planetary/apod?api_key=Ybiry7UGPIW6PzC3P2AunhHtNKd0loeZ91nNs3Wh&date=${encodeURIComponent(selectedDate)}`
      : "https://api.nasa.gov/planetary/apod?api_key=Ybiry7UGPIW6PzC3P2AunhHtNKd0loeZ91nNs3Wh";
    const response = await fetch(apodUrl, { method: "GET" });
    const date = await response.json();
    todayInSpaceContent.innerHTML = `<div class="max-w-7xl mx-auto">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h2 class="text-xl md:text-2xl font-space font-bold mb-1">
                Today in Space
              </h2>
              <p id="apod-date" class="text-slate-400 text-xs md:text-sm">
                Astronomy Picture of the Day - ${date.date}
              </p>
            </div>
            <div class="flex items-center space-x-2 md:space-x-3">
              <label for="apod-date-input" class="date-input-wrapper">
                <input
                  type="date"
                  id="apod-date-input"
                  class="custom-date-input"
                  value="${selectedDate}"
                  max="${new Date().toISOString().split("T")[0]}"
                  min="1995-06-16"
                />
                <span class="date-text text-sm">${selectedDate || "Select Date"}</span>
              </label>
              <button
                id="load-date-btn"
                class="px-3 md:px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold text-sm flex items-center space-x-1 md:space-x-2"
              >
                <i class="fas fa-search"></i>
                <span class="hidden sm:inline">Load</span>
              </button>
              <button
                id="today-apod-btn"
                class="px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors font-semibold text-sm"
              >
                Today
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div class="xl:col-span-2">
              <div
                id="apod-image-container"
                class="relative rounded-2xl overflow-hidden group h-[300px] md:h-[400px] lg:h-[600px] bg-slate-800/50 flex items-center justify-center"
              >
                <div id="apod-loading" class="text-center hidden">
                  <i
                    class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"
                  ></i>
                  <p class="text-slate-400">Loading today's image...</p>
                </div>
                <!-- Using a placeholder image or one from assets if available. Using a reliable external placeholder for now or a relative path if we knew one. Sticking to a colored placeholder div if no image, but let's try a realistic placeholder or just the rocket icon style used elsewhere if we want to be safe. But user wants design. I'll use a relative path assuming assets exist or a generic space placeholder. -->
                <img
                  id="apod-image"
                  class="w-full h-full object-cover"
                  src="${date.url || staticImageFallback}"
                  onerror="this.onerror=null;this.src='${staticImageFallback}'"
                  alt="Astronomy Picture of the Day"
                />
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div class="absolute bottom-6 left-6 right-6">
                    <button
                      class="w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                    <a href="${date.hdurl || date.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full h-full">
                      <i class="fas fa-expand mr-2"></i>View Full Resolution
                    </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4 md:space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6"
              >
                <h3
                  id="apod-title"
                  class="text-lg md:text-2xl font-semibold mb-3 md:mb-4"
                >
                  ${date.title}
                </h3>
                <div
                  class="flex items-center space-x-4 mb-4 text-sm text-slate-400"
                >
                  <span id="apod-date-detail"
                    ><i class="far fa-calendar mr-2"></i>${date.date}</span
                  >
                </div>
                <p
                  id="apod-explanation"
                  class="text-slate-300 leading-relaxed mb-4"
                >
                ${date.explanation}
                </p>
                <div
                  id="apod-copyright"
                  class="text-xs text-slate-400 italic mb-4"
                >
                  &copy; ${date.copyright || "NASA/JPL"}
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-3 flex items-center">
                  <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                  Image Details
                </h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Date</span>
                    <span id="apod-date-info" class="font-medium"
                      >${date.date}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Media Type</span>
                    <span id="apod-media-type" class="font-medium">${date.media_type}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Source</span>
                    <span class="font-medium">NASA APOD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  }
  catch (error) {
    todayInSpaceContent.innerHTML = `    <div class="max-w-7xl mx-auto">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h2 class="text-xl md:text-2xl font-space font-bold mb-1">
                Today in Space
              </h2>
              <p id="apod-date" class="text-slate-400 text-xs md:text-sm">
                Astronomy Picture of the Day - loading...
              </p>
            </div>
            <div class="flex items-center space-x-2 md:space-x-3">
              <label for="apod-date-input" class="date-input-wrapper">
                <input
                  type="date"
                  id="apod-date-input"
                  class="custom-date-input"
                  value="${selectedDate}"
                  max="${new Date().toISOString().split("T")[0]}"
                  min="1995-06-16"
                />
                <span class="text-sm">Dec 17, 2025</span>
              </label>
              <button
                id="load-date-btn"
                class="px-3 md:px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold text-sm flex items-center space-x-1 md:space-x-2"
              >
                <i class="fas fa-search"></i>
                <span class="hidden sm:inline">Load</span>
              </button>
              <button
                id="today-apod-btn"
                class="px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors font-semibold text-sm"
              >
                Today
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div class="xl:col-span-2">
              <div
                id="apod-image-container"
                class="relative rounded-2xl overflow-hidden group h-[300px] md:h-[400px] lg:h-[600px] bg-slate-800/50 flex items-center justify-center"
              >
                <div id="apod-loading" class="text-center hidden">
                  <i
                    class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"
                  ></i>
                  <p class="text-slate-400">Loading today's image...</p>
                </div>
                <!-- Using a placeholder image or one from assets if available. Using a reliable external placeholder for now or a relative path if we knew one. Sticking to a colored placeholder div if no image, but let's try a realistic placeholder or just the rocket icon style used elsewhere if we want to be safe. But user wants design. I'll use a relative path assuming assets exist or a generic space placeholder. -->    
              
              <div class="w-full h-full bg-slate-700 text-center flex  flex-col items-center justify-center">
                <i class="text-4xl text-red-400 mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
               <p class="text-slate-400 text-center">Failed to load image. Please try again later.</p>
              </div>
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div class="absolute bottom-6 left-6 right-6">
                  
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4 md:space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6"
              >
                <h3
                  id="apod-title"
                  class="text-lg md:text-2xl font-semibold mb-3 md:mb-4"
                >
                  loading...
                </h3>
                <div
                  class="flex items-center space-x-4 mb-4 text-sm text-slate-400"
                >
                  <span id="apod-date-detail"
                    ><i class="far fa-calendar mr-2"></i>loading...</span
                  >
                </div>
                <p
                  id="apod-explanation"
                  class="text-slate-300 leading-relaxed mb-4"
                >
                  Loading description...
                </p>
                <div
                  id="apod-copyright"
                  class="text-xs text-slate-400 italic mb-4"
                >
                  &copy; NASA/JPL
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-3 flex items-center">
                  <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                  Image Details
                </h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Date</span>
                    <span id="apod-date-info" class="font-medium"
                      >loading...</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Media Type</span>
                    <span id="apod-media-type" class="font-medium">loading...</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Source</span>
                    <span class="font-medium">loading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`}
}
fetchAPODByDate();
todayInSpaceContent.addEventListener("change", (e) => {
  if (!e.target.matches(".custom-date-input")) {
    return;
  }

  const selectedDate = e.target.value;
  if (selectedDate) {
    dateByCalendar = selectedDate;
    fetchAPODByDate(selectedDate);
    console.log("Selected date:", dateByCalendar); // Log the selected date to the console
  }
});

todayInSpaceContent.addEventListener("click", (e) => {
  const loadButton = e.target.closest("#load-date-btn");
  const todayButton = e.target.closest("#today-apod-btn");
  const dateInput = todayInSpaceContent.querySelector(".custom-date-input");

  if (loadButton && dateInput?.value) {
    dateByCalendar = dateInput.value;
    fetchAPODByDate(dateByCalendar);
  }

  if (todayButton) {
    dateByCalendar = "";
    fetchAPODByDate();
  }
});
/////////////////////////////////////////////////////////////////////

//fetch and display data for "Launches" section
async function fetchLaunches() {
  try {
    const response = await fetch("https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=20", { method: "GET" });
    const launches = await response.json();
    const finalLaunches = launches.results;
    launchLength = finalLaunches.length;
    const launchDataa = finalLaunches[0].Date || finalLaunches[0].net;
    const launchDatea = new Date(launchDataa);
    const formattedLaunchDate = launchDatea.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    FEATURED.innerHTML = `   <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${finalLaunches[0].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${finalLaunches[0].name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${finalLaunches[0].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${finalLaunches[0].rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">2</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${formattedLaunchDate}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${launchDatea.toLocaleTimeString()}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${finalLaunches[0].pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${finalLaunches[0].pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${finalLaunches[0].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ><img
                src="${finalLaunches[0].image?.thumbnail_url || staticImageFallback}"
                onerror="this.onerror=null;this.src='${staticImageFallback}'"
                alt="${finalLaunches[0].name}"
                class="w-full h-full object-cover"/> </div>
                  </div>
                </div>`
    launchesContent.innerHTML = "";
    for (let launch = 1; launch < finalLaunches.length; launch++) {
      const launchData = finalLaunches[launch];
      if (!launchData) {
        continue;
      }

      const launchDate = new Date(launchData.net || launchData.date);
      if (Number.isNaN(launchDate.getTime())) {
        continue;
      }
      launchesContent.innerHTML += `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
              <img
                src="${launchData.image?.thumbnail_url || staticImageFallback}"
                onerror="this.onerror=null;this.src='${staticImageFallback}'"
                alt="${launchData.name}"
                class="w-full h-full object-cover"/>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${launchData.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launchData.launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launchDate.toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launchDate.toLocaleTimeString()}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launchData.rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launchData.pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
    }
  } catch (error) {
    FEATURED.classList.remove("grid")
    FEATURED.innerHTML = `<div class="flex  justify-center gap-3 items-center">
<i class="text-4xl text-red-400 mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
                  <h1> fail loading please reload page or try a gain later</h1>
                </div>`

                launchesContent.innerHTML = `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
              <img
                src="assets/images/launch-placeholder.png"
                onerror="this.onerror=null;this.src='Failed to load'"
                alt="$Failed to load"
                class="w-full h-full object-cover"/>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    Failed to load. Please try again later.
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    Failed to load. Please try again later.
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">Failed to load </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">Failed to load</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">Failed to load</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">Failed to load</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`

  }
  header.innerHTML = `  <div class="px-4 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 lg:space-x-6">
              <button
                id="sidebar-toggle"
                class="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <i class="fas fa-bars text-white"></i>
              </button>
              <div>
                <h2
                  class="text-lg lg:text-xl font-space font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Space Explorer Dashboard
                </h2>
                <p class="text-xs text-slate-400 mt-0.5 hidden sm:block">
                  Real-time space data from NASA & SpaceDevs
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 md:space-x-4">
              <div
                class="flex items-center space-x-2 md:space-x-3 px-2 md:px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl"
              >
                <div class="flex items-center space-x-1 md:space-x-2">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-xs text-slate-400 hidden sm:inline"
                    >Live Data</span
                  >
                </div>
                <div class="w-px h-4 bg-slate-700 hidden sm:block"></div>
                <div class="flex items-center space-x-1 md:space-x-2">
                  <i class="fas fa-globe text-blue-400 text-sm"></i>
                  <span
                    class="text-xs text-slate-300 font-semibold hidden sm:inline"
                    >8 </span
                  >
                  <span class="text-xs text-slate-300 font-semibold sm:hidden"
                    >8</span
                  >
                </div>
                <div class="w-px h-4 bg-slate-700 hidden sm:block"></div>
                <div class="flex items-center space-x-1 md:space-x-2">
                  <i class="fas fa-rocket text-purple-400 text-sm"></i>
                  <span
                    class="text-xs text-slate-300 font-semibold hidden sm:inline"
                    id="launches-count"
                    >${launchLength} Launches</span
                  >
                  <span
                    class="text-xs text-slate-300 font-semibold sm:hidden"
                    id="launches-count-mobile"
                    >${launchLength}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>`
}
fetchLaunches()
//////////////////////////////////////////////////////////////////////


//fetch and display data for "Planets" section
async function fetchPlanets() {
  try {
    const plantsUrl = await fetch(`https://solar-system-opendata-proxy.vercel.app/api/planets`);
    const plantsResponse = await plantsUrl.json();
    const { bodies } = plantsResponse
    planetsData = bodies;
    let planet = bodies[6]
    console.log(bodies)
    plantsCardInfo.innerHTML =`  <div
              class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
            >
              <div
                class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0"
              >
                <div
                  class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6"
                >
                  <img
                    id="planet-detail-image"
                    class="w-full h-full object-contain"
                    src="${planet.image}"
                    alt="earth planet detailed realistic render with clouds and continents"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3 md:mb-4">
                    <h3
                      id="planet-detail-name"
                      class="text-2xl md:text-3xl font-space font-bold"
                    >
                      ${planet.englishName}
                    </h3>
                    <button
                      class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <i class="far fa-heart"></i>
                    </button>
                  </div>
                  <p
                    id="planet-detail-description"
                    class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
                  >
                  ${planet.description}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-ruler text-xs"></i>
                    <span class="text-xs">Semimajor Axis</span>
                  </p>
                  <p
                    id="planet-distance"
                    class="text-sm md:text-lg font-semibold"
                  >
                  ${(planet.semimajorAxis / 1000000).toFixed(1) + "M"} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-circle"></i>
                    Mean Radius
                  </p>
                  <p id="planet-radius" class="text-lg font-semibold">
                    ${planet.meanRadius} Km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-weight"></i>
                    Mass
                  </p>
                  <p id="planet-mass" class="text-lg font-semibold">
                    ${planet.mass.massValue * 10 ** planet.mass.massExponent}
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-compress"></i>
                    Density
                  </p>
                  <p id="planet-density" class="text-lg font-semibold">
                    ${planet.density} g/cm³
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-sync-alt"></i>
                    Orbital Period
                  </p>
                  <p id="planet-orbital-period" class="text-lg font-semibold">
                    ${planet.sideralOrbit} days
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-redo"></i>
                    Rotation Period
                  </p>
                  <p id="planet-rotation" class="text-lg font-semibold">
                    ${planet.sideralRotation.toFixed(0)} hours
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-moon"></i>
                    Moons
                  </p>
                  <p id="planet-moons" class="text-lg font-semibold">${Array.isArray(planet.moons) ? planet.moons.length : 0}</p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                    Gravity
                  </p>
                  <p id="planet-gravity" class="text-lg font-semibold">
                    ${planet.gravity} m/s²
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                  Discovery Info
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovered By</span>
                    <span
                      id="planet-discoverer"
                      class="font-semibold text-right"
                      >${planet.discoveredBy ||"Known since antiquity"}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovery Date</span>
                    <span id="planet-discovery-date" class="font-semibold"
                      >${planet.discoveryDate || "Ancient"}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Body Type</span>
                    <span id="planet-body-type" class="font-semibold"
                      >${planet.bodyType}</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Volume</span>
                    <span id="planet-volume" class="font-semibold">N/A</span>
                  </div>
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                  Quick Facts
                </h4>
                <ul id="planet-facts" class="space-y-3 text-sm">
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Mass: ${planet.mass.massValue *10 ** planet.mass.massExponent} kg</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Surface gravity: ${planet.gravity} m/s²</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Density:${planet.density} g/cm³</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Axial tilt: ${planet.axialTilt}°</span
                    >
                  </li>
                </ul>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-satellite text-blue-400 mr-2"></i>
                  Orbital Characteristics
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Perihelion</span>
                    <span id="planet-perihelion" class="font-semibold"
                      >${(planet.perihelion/1000000).toFixed(1)+"M"} km</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Aphelion</span>
                    <span id="planet-aphelion" class="font-semibold"
                      >${(planet.aphelion/1000000).toFixed(1)+"M"} Km</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Eccentricity</span>
                    <span id="planet-eccentricity" class="font-semibold"
                      >${planet.eccentricity}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Inclination</span>
                    <span id="planet-inclination" class="font-semibold"
                      >${planet.inclination}°</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Axial Tilt</span>
                    <span id="planet-axial-tilt" class="font-semibold"
                      >${planet.axialTilt}°</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Avg Temperature</span>
                    <span id="planet-temp" class="font-semibold">${planet.avgTemp}°C</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Escape Velocity</span>
                    <span id="planet-escape" class="font-semibold"
                      >${planet.escape /1000} km/s</span
                    >
                  </div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                <i class="fas fa-book mr-2"></i>Learn More
              </button>
            </div>`
    planetsGrid.innerHTML = "";
    for (let i of bodies) {
      planetsGrid.innerHTML += ` <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${i.id}"
              style="--planet-color: #f97316"
              onmouseover="this.style.borderColor='#f9731680'"
              onmouseout="this.style.borderColor='#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${i.image}"
                  alt="${i.name}"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${i.englishName}</h4>
              <p class="text-xs text-slate-400 text-center">${(i.semimajorAxis / au).toFixed(2)} AU</p>
            </div>`
    }

    planetsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".planet-card");
      if (!card) return;

      const selectedId = card.dataset.planetId;
      planet = planetsData.find(
        (p) => String(p.id) === String(selectedId)
      );

      if (!planet) {
        console.warn("No planet found for card:", selectedId);
        return;
      }
      console.log(planet)

      plantsCardInfo.innerHTML = `  <div
              class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
            >
              <div
                class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0"
              >
                <div
                  class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6"
                >
                  <img
                    id="planet-detail-image"
                    class="w-full h-full object-contain"
                    src="${planet.image}"
                    alt="earth planet detailed realistic render with clouds and continents"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3 md:mb-4">
                    <h3
                      id="planet-detail-name"
                      class="text-2xl md:text-3xl font-space font-bold"
                    >
                      ${planet.englishName}
                    </h3>
                    <button
                      class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <i class="far fa-heart"></i>
                    </button>
                  </div>
                  <p
                    id="planet-detail-description"
                    class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
                  >
                  ${planet.description}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-ruler text-xs"></i>
                    <span class="text-xs">Semimajor Axis</span>
                  </p>
                  <p
                    id="planet-distance"
                    class="text-sm md:text-lg font-semibold"
                  >
                  ${(planet.semimajorAxis / 1000000).toFixed(1) + "M"} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-circle"></i>
                    Mean Radius
                  </p>
                  <p id="planet-radius" class="text-lg font-semibold">
                    ${planet.meanRadius} Km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-weight"></i>
                    Mass
                  </p>
                  <p id="planet-mass" class="text-lg font-semibold">
                    ${planet.mass.massValue * 10 ** planet.mass.massExponent}
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-compress"></i>
                    Density
                  </p>
                  <p id="planet-density" class="text-lg font-semibold">
                    ${planet.density} g/cm³
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-sync-alt"></i>
                    Orbital Period
                  </p>
                  <p id="planet-orbital-period" class="text-lg font-semibold">
                    ${planet.sideralOrbit} days
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-redo"></i>
                    Rotation Period
                  </p>
                  <p id="planet-rotation" class="text-lg font-semibold">
                    ${planet.sideralRotation.toFixed(0)} hours
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-moon"></i>
                    Moons
                  </p>
                  <p id="planet-moons" class="text-lg font-semibold">${Array.isArray(planet.moons) ? planet.moons.length : 0}</p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                    Gravity
                  </p>
                  <p id="planet-gravity" class="text-lg font-semibold">
                    ${planet.gravity} m/s²
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                  Discovery Info
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovered By</span>
                    <span
                      id="planet-discoverer"
                      class="font-semibold text-right"
                      >${planet.discoveredBy ||"Known since antiquity"}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovery Date</span>
                    <span id="planet-discovery-date" class="font-semibold"
                      >${planet.discoveryDate || "Ancient"}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Body Type</span>
                    <span id="planet-body-type" class="font-semibold"
                      >${planet.bodyType}</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Volume</span>
                    <span id="planet-volume" class="font-semibold">N/A</span>
                  </div>
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                  Quick Facts
                </h4>
                <ul id="planet-facts" class="space-y-3 text-sm">
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Mass: ${planet.mass.massValue *10 ** planet.mass.massExponent} kg</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Surface gravity: ${planet.gravity} m/s²</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Density:${planet.density} g/cm³</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Axial tilt: ${planet.axialTilt}°</span
                    >
                  </li>
                </ul>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-satellite text-blue-400 mr-2"></i>
                  Orbital Characteristics
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Perihelion</span>
                    <span id="planet-perihelion" class="font-semibold"
                      >${(planet.perihelion/1000000).toFixed(1)+"M"} km</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Aphelion</span>
                    <span id="planet-aphelion" class="font-semibold"
                      >${(planet.aphelion/1000000).toFixed(1)+"M"} Km</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Eccentricity</span>
                    <span id="planet-eccentricity" class="font-semibold"
                      >${planet.eccentricity}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Inclination</span>
                    <span id="planet-inclination" class="font-semibold"
                      >${planet.inclination}°</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Axial Tilt</span>
                    <span id="planet-axial-tilt" class="font-semibold"
                      >${planet.axialTilt}°</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Avg Temperature</span>
                    <span id="planet-temp" class="font-semibold">${planet.avgTemp}°C</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Escape Velocity</span>
                    <span id="planet-escape" class="font-semibold"
                      >${planet.escape /1000} km/s</span
                    >
                  </div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                <i class="fas fa-book mr-2"></i>Learn More
              </button>
            </div>`


    });

    const colors = ["22d3ee", "2563eb", "fdba74", "ef4444", "6b7280", "fde047", "3b82f6", "fb923c"]
    planetTbody.innerHTML = ""
    for (let index = 0; index < bodies.length; index++) {
      const u = bodies[index]
      const c = colors[index % colors.length]
      planetTbody.innerHTML += `<tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: #${c}"
                          ></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${u.englishName}</span>
                          </span>
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${(u.semimajorAxis / au).toFixed(2)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${(u.meanRadius * 2 / 1000).toFixed(2)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        0.055
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${typeof u.sideralOrbit === 'number' ? (u.sideralOrbit < 365 ? u.sideralOrbit.toFixed(0) + ' days' : (u.sideralOrbit / 365).toFixed(1) + ' years') : 'N/A'}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${Array.isArray(u.moons) ? u.moons.length : 0}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"  style="background-color: #${c}; opacity: 0.6;"
                          >${u.type}</span>
                      </td>
                    </tr>`
    }

  } catch (error) {
    planetTbody.innerHTML = `<td></td> <td></td>  <td></td> <td><div style="width:100%; min-height:500px; display:flex; align-items:center; justify-content:center;  color:#cbd5e1; font-size:1.25rem; border-radius:1rem; padding:2rem; text-align:center;">
        <div>
          <p style="margin:0; font-weight:700;">Unable to load planet data</p>
          <p style="margin:0.5rem 0 0; color:#94a3b8;">Please refresh the page or try again later.</p>
        </div>
      </div> </td>`
    planetsGrid.innerHTML = `  <div class="mb-6 md:mb-8 w-100 cols-8">
            <h2 class="">
              Please refresh the page or try again later
            </h2>
            
          </div>`
  }

}
fetchPlanets();
//////////////////////////////////////////////////////////////////////
