document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. SIDEBAR ACTIVE NAV LINK HIGHLIGHTER
    // ==========================================================================
    const links = document.querySelectorAll(".sidebar nav a");
    let currentPage = window.location.pathname.split("/").pop();
    
    if (currentPage === "" || currentPage === "index.html") {
        currentPage = "index.html";
    }

    links.forEach(link => {
        const hrefAttr = link.getAttribute("href");
        link.classList.remove("active");
        if (hrefAttr === currentPage) {
            link.classList.add("active");
        }
    });

    // ==========================================================================
    // 2. CONTACT FORM SUBMISSION POPUP (Only runs on contact page)
    // ==========================================================================
    const contactForm = document.querySelector('.contact-form');
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const closeAlertBtn = document.getElementById('close-alert-btn');

    if (contactForm && alertOverlay && closeAlertBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alertOverlay.classList.add('show-alert');
        });

        closeAlertBtn.addEventListener('click', () => {
            alertOverlay.classList.remove('show-alert');
        });
    }

    // ==========================================================================
    // 3. LIGHTBOX GALLERY SYSTEM (Only runs on destination gallery pages)
    // ==========================================================================
    // Check if the card-grid exists AND we are on a gallery page that uses gallery.css
    const galleryGrid = document.querySelector(".card-grid");
    const isGalleryPage = document.querySelector('link[href="gallery.css"]');

    if (galleryGrid && isGalleryPage) {
        // Step A: Dynamically create the lightbox layout components
        const lightboxModal = document.createElement("div");
        lightboxModal.classList.add("lightbox-modal");
        
        const lightboxClose = document.createElement("span");
        lightboxClose.classList.add("lightbox-close");
        lightboxClose.innerHTML = "&times;"; // Renders the "×" symbol
        
        const lightboxImg = document.createElement("img");
        lightboxImg.classList.add("lightbox-content");
        
        // Assemble the container elements
        lightboxModal.appendChild(lightboxClose);
        lightboxModal.appendChild(lightboxImg);
        document.body.appendChild(lightboxModal);

        // Step B: Bind click listeners to individual thumbnail images
        const galleryImages = galleryGrid.querySelectorAll(".card img");

        galleryImages.forEach(img => {
            img.addEventListener("click", () => {
                const imgSrc = img.getAttribute("src");
                lightboxImg.setAttribute("src", imgSrc);
                lightboxModal.classList.add("show-lightbox");
            });
        });

        // Step C: Bind exit trigger loop to the "X" close button
        lightboxClose.addEventListener("click", (e) => {
            e.stopPropagation();
            lightboxModal.classList.remove("show-lightbox");
        });
    }

    // ==========================================================================
    // 4. TRANSPORTATION INTERACTIVE DETAILS SYSTEM (Only runs on transport page)
    // ==========================================================================
    const infoButtons = document.querySelectorAll(".transport-btn");
    const detailsContainer = document.getElementById("details-container");
    const detailsContent = document.getElementById("details-content");
    const closeDetailsBtn = document.getElementById("close-details");

    // Localized database object containing the custom layouts for each transit choice
    const transportData = {
        train: `
            <div class="details-title-row">
                <div class="transport-icon-box">🚄</div>
                <h4>High-Speed Rail Mainlines & Schedules</h4>
            </div>
            <p style="color: #aaa; margin-bottom: 15px;">Frequent primary daily departures across main tourist corridors:</p>
            <table class="info-table">
                <tr><th>Route Link</th><th>Average Duration</th><th>Frequency</th></tr>
                <tr><td>Beijing &leftrightarrow; Shanghai</td><td>4h 18m</td><td>Every 10-15 mins</td></tr>
                <tr><td>Beijing &leftrightarrow; Xi'an</td><td>4h 30m</td><td>Every 30 mins</td></tr>
                <tr><td>Shanghai &leftrightarrow; Hangzhou</td><td>0h 45m</td><td>Every 10 mins</td></tr>
            </table>
        `,
        metro: `
            <div class="details-title-row">
                <div class="transport-icon-box">🚇</div>
                <h4>Metropolitan Subway System Integrations</h4>
            </div>
            <ul class="info-list">
                <li>🟢 <strong>Payment Options:</strong> Use the 'Transport Card' mini-program inside WeChat/Alipay or purchase single tickets at English kiosks.</li>
                <li>🟢 <strong>Operation Hours:</strong> Generally lines run from 05:30 AM until 11:30 PM.</li>
                <li>🟢 <strong>Navigation Tip:</strong> Download the <em>'MetroMan'</em> app for full offline schedules and terminal navigation details.</li>
            </ul>
        `,
        didi: `
            <div class="details-title-row">
                <div class="transport-icon-box">🚗</div>
                <h4>DiDi Ride Hailing International Setup Guide</h4>
            </div>
            <ul class="info-list">
                <li>📱 <strong>Step 1:</strong> Open your Alipay application or download the standalone DiDi App.</li>
                <li>📱 <strong>Step 2:</strong> Switch layout interface language setting to English. International credit cards (Visa/Mastercard) are fully supported.</li>
                <li>📱 <strong>Step 3:</strong> The system automatically translates messages sent to drivers into Chinese characters in real-time.</li>
            </ul>
        `,
        maglev: `
            <div class="details-title-row">
                <div class="transport-icon-box">⚡</div>
                <h4>Shanghai Maglev Speed & Pricing Metrics</h4>
            </div>
            <table class="info-table">
                <tr><th>Ticket Type</th><th>One-Way Price</th><th>Round-Trip Fare (7 Days)</th></tr>
                <tr><td>Ordinary Seat</td><td>¥50 rmb</td><td>¥80 rmb</td></tr>
                <tr><td>VIP Class Seat</td><td>¥100 rmb</td><td>¥160 rmb</td></tr>
            </table>
            <p style="color: #aaa; font-size: 13px; margin-top: 10px;">*Tip: Present your same-day flight boarding pass to receive a 20% discount on standard seats (¥40 rmb).</p>
        `,
        bus: `
            <div class="details-title-row">
                <div class="transport-icon-box">🚌</div>
                <h4>City Bus Routes Guide</h4>
            </div>
            <ul class="info-list">
                <li>📍 <strong>Fare Rate:</strong> Flat rate of ¥2 rmb inside most municipal city lines.</li>
                <li>📍 <strong>Tracking Lines:</strong> Use Apple Maps or Amap (Gaode) to accurately see real-time upcoming bus vehicle arrivals.</li>
            </ul>
        `,
        bike: `
            <div class="details-title-row">
                <div class="transport-icon-box">🚲</div>
                <h4>Sidewalk Bike Sharing Procedures</h4>
            </div>
            <p style="color: #ddd;">Look for bright blue (Hellobike), yellow (Meituan), or green (DiDi) bikes along sidewalks. Simply scan the QR code located between the handlebars using your payment app to instantly unlock the bicycle.</p>
        `
    };

    // Bind event handlers if elements exist on the page
    if (infoButtons.length > 0 && detailsContainer && detailsContent) {
        infoButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const choice = btn.getAttribute("data-target");
                
                if (transportData[choice]) {
                    // Update content
                    detailsContent.innerHTML = transportData[choice];
                    
                    // Reveal the container card
                    detailsContainer.classList.add("active");
                    
                    // Smooth scroll to view the new information panel
                    detailsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    // Close Button Event Handler for Details Panel
    if (closeDetailsBtn && detailsContainer) {
        closeDetailsBtn.addEventListener("click", () => {
            detailsContainer.classList.remove("active");
        });
    }

});

// ==========================================================================
    // 5. HOTEL REAL BOOKING RESERVATION SYSTEM (Only runs on hotels page)
    // ==========================================================================
    const hotelInquireButtons = document.querySelectorAll(".hotel-btn");
    const bookingContainer = document.getElementById("booking-container");
    const selectedHotelName = document.getElementById("selected-hotel-name");
    const closeBookingBtn = document.getElementById("close-booking");
    const hotelInquiryForm = document.getElementById("hotel-inquiry-form");

    // Dynamic calculator targets
    const checkInInput = document.getElementById("check-in");
    const checkOutInput = document.getElementById("check-out");
    const roomTypeSelect = document.getElementById("room-type");
    const roomCountInput = document.getElementById("room-count");
    const displayBaseRate = document.getElementById("display-base-rate");
    const displayNights = document.getElementById("display-nights");
    const displayRooms = document.getElementById("display-rooms");
    const displayTotalCost = document.getElementById("display-total-cost");

    let currentActiveBasePrice = 0;
    let selectedHotelTitle = "";

    // Live calculation tracking loops
    function calculateLiveBookingCost() {
        if (!checkInInput || !checkOutInput || !roomTypeSelect || !roomCountInput) return;

        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        const roomMultiplier = parseFloat(roomTypeSelect.value);
        const roomCount = parseInt(roomCountInput.value, 10) || 1;

        // Display selected rooms count in summary
        if (displayRooms) {
            displayRooms.innerText = `${roomCount} room${roomCount > 1 ? 's' : ''}`;
        }

        if (checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {
            // Calculate total difference in days
            const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
            const totalNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
            
            // Compute real pricing including total room count factor
            const totalCost = currentActiveBasePrice * roomMultiplier * totalNights * roomCount;

            // Output values into HTML structure labels
            displayNights.innerText = `${totalNights} night${totalNights > 1 ? 's' : ''}`;
            displayTotalCost.innerText = `¥${totalCost.toLocaleString()}`;
        } else {
            // Default reset states for bad or missing inputs
            displayNights.innerText = "0 nights";
            displayTotalCost.innerText = "¥0";
        }
    }

    if (hotelInquireButtons.length > 0 && bookingContainer && selectedHotelName) {
        hotelInquireButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                selectedHotelTitle = btn.getAttribute("data-target");
                currentActiveBasePrice = parseInt(btn.getAttribute("data-price"), 10);
                
                // Update basic header panels
                selectedHotelName.innerText = `Book: ${selectedHotelTitle}`;
                if (displayBaseRate) displayBaseRate.innerText = `¥${currentActiveBasePrice} / night`;
                
                // Refresh cost state metric resets
                if (hotelInquiryForm) hotelInquiryForm.reset();
                calculateLiveBookingCost();

                // Open display drawer view link block
                bookingContainer.classList.add("active");
                bookingContainer.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });

        // Event hooks to process changes seamlessly on input adjustments
        [checkInInput, checkOutInput, roomTypeSelect, roomCountInput].forEach(element => {
            if (element) {
                element.addEventListener("change", calculateLiveBookingCost);
                element.addEventListener("input", calculateLiveBookingCost);
            }
        });
    }

    // Close Button Handling
    if (closeBookingBtn && bookingContainer) {
        closeBookingBtn.addEventListener("click", () => {
            bookingContainer.classList.remove("active");
        });
    }

// Custom Modal Call Targets
    const customAlertModal = document.getElementById("custom-alert-modal");
    const alertModalMessage = document.getElementById("alert-modal-message");
    const closeAlertModalBtn = document.getElementById("close-alert-modal");

    // Custom Error Modal Call Targets
    const customErrorModal = document.getElementById("custom-error-modal");
    const errorModalMessage = document.getElementById("error-modal-message");
    const closeErrorModalBtn = document.getElementById("close-error-modal");

    // Submission Handler with Custom Success & Error Popups
    if (hotelInquiryForm && bookingContainer) {
        hotelInquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const guestName = document.getElementById("guest-name").value;
            const guestEmail = document.getElementById("guest-email").value;
            const paxCount = parseInt(document.getElementById("pax-count").value, 10) || 1;
            const totalRooms = parseInt(document.getElementById("room-count").value, 10) || 1;
            
            // Calculate maximum allowed guests based on selected rooms
            const maxAllowedPax = totalRooms * 4;

            // Enforce capacity rule check using the custom popup modal
            if (paxCount > maxAllowedPax) {
                if (errorModalMessage && customErrorModal) {
                    errorModalMessage.innerHTML = `Maximum capacity is <strong>4 guests per room</strong>.<br><br>For <strong>${totalRooms} room(s)</strong>, you can only register a maximum of <strong>${maxAllowedPax} guests total</strong>. Please adjust your room or guest counts.`;
                    customErrorModal.style.display = "flex";
                }
                return; // Stops execution so success modal doesn't open
            }
            
            // Success Modal Execution Flow
            if (alertModalMessage && customAlertModal) {
                alertModalMessage.innerHTML = `Thank you, <strong>${guestName}</strong>! Your reservation for <strong>${paxCount} Pax</strong> (${totalRooms} Room) at <strong>"${selectedHotelTitle}"</strong> has been successfully confirmed.<br><br>An email verification details sheet has been dispatched to <em>${guestEmail}</em>.`;
                customAlertModal.style.display = "flex";
            }

            // Reset form panel states
            hotelInquiryForm.reset();
            bookingContainer.classList.remove("active");
        });
    }

    // Success Modal Close Action Listener
    if (closeAlertModalBtn && customAlertModal) {
        closeAlertModalBtn.addEventListener("click", () => {
            customAlertModal.style.display = "none";
        });
    }

    // Error Modal Close Action Listener
    if (closeErrorModalBtn && customErrorModal) {
        closeErrorModalBtn.addEventListener("click", () => {
            customErrorModal.style.display = "none";
        });
    }







    // ==========================================================================
// PERSISTENT GLOBAL THEME TOGGLE SYSTEM (LOCALSTORAGE)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn?.querySelector(".theme-icon");
    const themeText = themeToggleBtn?.querySelector(".theme-text");
    const dateInputs = document.querySelectorAll('.form-group input[type="date"]');

    // 1. Check if the user has a previously saved theme setting in their browser
    const savedTheme = localStorage.getItem("website-theme");

    // Function to apply light configuration styles instantly
    function enableLightMode() {
        document.body.classList.add("light-mode");
        if (themeIcon) themeIcon.textContent = "🌙";
        if (themeText) themeText.textContent = "Dark Mode";
        dateInputs.forEach(input => input.style.colorScheme = "light");
        localStorage.setItem("website-theme", "light");
    }

    // Function to revert to original dark style layout properties
    function disableLightMode() {
        document.body.classList.remove("light-mode");
        if (themeIcon) themeIcon.textContent = "☀️";
        if (themeText) themeText.textContent = "Light Mode";
        dateInputs.forEach(input => input.style.colorScheme = "dark");
        localStorage.setItem("website-theme", "dark");
    }

    // 2. Initialize the saved state right when the page finishes rendering
    if (savedTheme === "light") {
        enableLightMode();
    } else {
        disableLightMode();
    }

    // 3. Listen for clicks on the toggle button to swap values smoothly
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isCurrentlyLight = document.body.classList.contains("light-mode");
            if (isCurrentlyLight) {
                disableLightMode();
            } else {
                enableLightMode();
            }
        });
    }
});




// ==========================================================================
// HOME PAGE CULTURAL EVENTS CALENDAR LOGIC
// ==========================================================================
const calendarMonthYear = document.getElementById("calendar-month-year");
const calendarDaysContainer = document.getElementById("calendar-days");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

const eventTitle = document.getElementById("event-title");
const eventDateText = document.getElementById("event-date-text");
const eventDescription = document.getElementById("event-description");

// Simulated database array of cultural holidays
const dynamicEventsList = {
    "2026-05-20": { title: "Dragon Boat Festival", desc: "Famous traditional festival features exciting dragon boat racing tracking loops along regional waterways and eating delicious Zongzi sticky rice wraps." },
    "2026-06-18": { title: "Shanghai International Film Festival", desc: "One of East Asia's largest cinema conventions. Bringing global film creators, premier show screenings, and red carpet operations to theater circuits." },
    "2026-09-25": { title: "Mid-Autumn Moon Festival", desc: "A gorgeous moonlit harvest reunion event celebrate by sharing sweet mooncakes bakery items, hanging structural red lanterns, and star-gazing gatherings." },
    "2026-10-01": { title: "National Golden Week Day", desc: "The start of National Day golden week holidays layout. Expect spectacular municipal fireworks, city parades, and massive cultural exhibitions across mainland avenues." }
};

// Set working base directory parameter inside June 2026 calendar loop framework
let calendarCurrentDate = new Date(2026, 5, 1); 

function generateCalendarLayout() {
    if (!calendarDaysContainer) return;
    
    calendarDaysContainer.innerHTML = "";
    const currentYear = calendarCurrentDate.getFullYear();
    const currentMonth = calendarCurrentDate.getMonth();

    // Text label update helper
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (calendarMonthYear) calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Compute layout structural offsets
    const initialFirstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Append preceding blank day placeholder padding spaces
    for (let i = 0; i < initialFirstDayIndex; i++) {
        const spacerCell = document.createElement("div");
        spacerCell.classList.add("cal-day", "empty-slot");
        calendarDaysContainer.appendChild(spacerCell);
    }

    // Generate individual day grid cells loops
    for (let currentDayNo = 1; currentDayNo <= totalDaysInMonth; currentDayNo++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("cal-day");
        dayCell.textContent = currentDayNo;

        // String lookup format builder (YYYY-MM-DD)
        const checkFormatString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDayNo).padStart(2, '0')}`;

        if (dynamicEventsList[checkFormatString]) {
            dayCell.classList.add("has-event");
            
            // Assign direct click logic hook
            dayCell.addEventListener("click", () => {
                // Clear existing selections tags first
                document.querySelectorAll(".cal-day").forEach(d => d.classList.remove("selected-active"));
                dayCell.classList.add("selected-active");

                // Inject event description logs right into display cards
                const metadata = dynamicEventsList[checkFormatString];
                if (eventTitle) eventTitle.textContent = metadata.title;
                if (eventDateText) eventDateText.textContent = `📅 Occurs on: ${monthNames[currentMonth]} ${currentDayNo}, ${currentYear}`;
                if (eventDescription) eventDescription.textContent = metadata.desc;
            });
        }

        calendarDaysContainer.appendChild(dayCell);
    }
}

// Attach Pagination Navigation Clickers triggers 
if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
        generateCalendarLayout();
    });
    nextMonthBtn.addEventListener("click", () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
        generateCalendarLayout();
    });
}

// Kickstart rendering process automatically upon resource completion loading states
document.addEventListener("DOMContentLoaded", () => {
    generateCalendarLayout();
});