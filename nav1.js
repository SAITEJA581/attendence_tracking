document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from localStorage
    const admissionNumber = localStorage.getItem('admissionNumber');
    const studentName = localStorage.getItem('studentName');
    const studentDob = localStorage.getItem('studentDob');
    const profileSem = localStorage.getItem('profileSem') || '';

    // Reset year, course, and father's name for every login
    localStorage.removeItem('profileYear');
    localStorage.removeItem('profileCourse');
    localStorage.removeItem('profileFatherName');


    // Display admission number and name in the nav bar
    document.getElementById('adminNoDisplay').textContent = admissionNumber || 'No admission number found';
    document.getElementById('nameDisplay').textContent = studentName || 'No name found';

    // Set default values in the profile form
    if (studentName) {
        document.getElementById('profileName').value = studentName;
    }
    if (studentDob) {
        document.getElementById('profileDob').value = new Date(studentDob).toISOString().split('T')[0]; // Format for date input
    }

    // Display semester in the profile section
    document.getElementById('profileSem').value = profileSem;
    document.getElementById('profileYear').value = '';  // Reset year
    document.getElementById('profileCourse').value = '';  // Reset course
    document.getElementById('profileFatherName').value = '';  // Reset father's name


        // Profile link click event to show the profile content
    document.getElementById('profileLink').addEventListener('click', function (event) {
    event.preventDefault();
    showContent('profileContent');


    // Retrieve the student's admission number from localStorage
    const admissionNumber = localStorage.getItem('admissionNumber');

    // Fetch student data from JSON and populate the profile form
    fetch('data.json') // Assuming your JSON file is named students.json
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === admissionNumber);

            if (student) {
                document.getElementById('profileName').value = student.name;
                document.getElementById('profileDob').value = student.dob;
                document.getElementById('profileYear').value = student.year;
                document.getElementById('profileSem').value = student.semester;
                document.getElementById('profileCourse').value = student.course;
                document.getElementById('profileFatherName').value = student.fathersName;
            } else {
                alert('No student data found');
            }
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
});

    // Initialize the page to hide all content sections initially
    hideAllContent();


    // Home link click event to show the home content
    document.getElementById('homeLink').addEventListener('click', function (event) {
        event.preventDefault();
        showContent('homeContent');
    });

    // Profile link click event to show the profile content
    document.getElementById('profileLink').addEventListener('click', function (event) {
        event.preventDefault();
        showContent('profileContent');
    });

    // Attendance link click event to show the attendance content
    document.getElementById('attendanceLink').addEventListener('click', function (event) {
        event.preventDefault();
        displaySavedAttendance('daily'); // Show daily attendance
        showContent('attendanceContent');
    });   

            // Function to show the desired content and hide others
    function showContent(contentId) {
        hideAllContent();
        document.getElementById(contentId).style.display = 'block';
        document.getElementById('attendanceContainer').style.display = 'none'; // Always hide the attendance container
    }

    // Function to hide all content sections
    function hideAllContent() {
        document.getElementById('homeContent').style.display = 'none';
        document.getElementById('profileContent').style.display = 'none';
        document.getElementById('attendanceContent').style.display = 'none';
        document.getElementById('dispatchFineContent').style.display = 'none';
        document.getElementById('attendanceContainer').style.display = 'none';
    }


     // Event listener for "Attendance Tracking" link
     document.getElementById('attendenceTracking').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        displaySavedAttendance('tracking'); // Show monthly summary (tracking mode)


        // Hide the attendance details section
        document.getElementById('attendanceContent').style.display = 'none';

        // Show the attendance container section
        document.getElementById('attendanceContainer').style.display = 'block';
    });




function displaySavedAttendance() {
    // Retrieve saved attendance records from localStorage
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const loggedInAdmissionNumber = localStorage.getItem('admissionNumber'); // Get logged-in student's admission number

    if (attendanceRecords.length === 0) {
        alert("No attendance records found.");
        return;
    }

    // Clear previous data in the left column
    const leftAttendanceData = document.getElementById('leftAttendanceData');
    leftAttendanceData.innerHTML = ''; 

    // Create an object to keep track of sections by month and year
    const attendanceSections = {};

    // Filter the records by admission number
    const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);

    if (filteredRecords.length === 0) {
        alert("No attendance records found for this admission number.");
        return;
    }

    // Loop through the filtered records (each representing a different month)
    filteredRecords.forEach(record => {
        const sectionKey = `${record.month}-${record.year}`; // Unique key for each month-year combo

        let monthSection;
        let attendanceTable;

        // Check if a section for the same month and year already exists
        if (attendanceSections[sectionKey]) {
            // Use the existing section and table
            monthSection = attendanceSections[sectionKey].section;
            attendanceTable = attendanceSections[sectionKey].table;
        } else {
            // Create a new section for this month and year
            monthSection = document.createElement('div');
            monthSection.classList.add('attendance-section');

            // Display month and year in the header
            const monthYearHeader = document.createElement('h3');
            monthYearHeader.textContent = `Attendance for ${record.month}/${record.year}`;
            monthSection.appendChild(monthYearHeader);

            // Create a table for displaying attendance data
            attendanceTable = document.createElement('table');
            attendanceTable.classList.add('attendance-table'); // Optional: Add a class for styling

            // Create table headers for date and each subject ID
            const headerRow = document.createElement('tr');
            const dateHeader = document.createElement('th');
            dateHeader.textContent = 'Date';
            headerRow.appendChild(dateHeader);

            // Add a column for each subject (using subject IDs as headers)
            record.subjects.forEach(subject => {
                const subjectHeader = document.createElement('th');
                subjectHeader.textContent = `Subject ID: ${subject.id}`;
                headerRow.appendChild(subjectHeader);
            });

            attendanceTable.appendChild(headerRow);
            monthSection.appendChild(attendanceTable);

            // Save the section and table in the object for future reference
            attendanceSections[sectionKey] = { section: monthSection, table: attendanceTable };

            // Add the section to the DOM
            leftAttendanceData.appendChild(monthSection);
        }

        // Loop through each day of attendance for the current month
        const numDays = record.subjects[0].dailyAttendance.length; // Assuming all subjects have the same number of days

        for (let i = 0; i < numDays; i++) {
            // Check if there's at least one valid status (P or A) for this day
            let hasValidStatus = false;

            record.subjects.forEach(subject => {
                const status = subject.dailyAttendance[i].status.trim().toUpperCase();
                if (status === 'P' || status === 'A') {
                    hasValidStatus = true;
                }
            });

            // Only proceed if there is at least one valid attendance status
            if (hasValidStatus) {
                const row = document.createElement('tr');

                // Left Column: Add Date (only if there's valid attendance data)
                const dateElement = document.createElement('td');
                dateElement.textContent = record.subjects[0].dailyAttendance[i].date; // Date in DD/MM/YYYY format
                row.appendChild(dateElement);

                // Right Columns: Add Attendance Status (P/A) for each subject
                record.subjects.forEach(subject => {
                    const statusElement = document.createElement('td');
                    const status = subject.dailyAttendance[i].status.trim().toUpperCase();

                    // Only append the status if it's 'P' or 'A'
                    if (status === 'P' || status === 'A') {
                        statusElement.textContent = status;
                    } else {
                        statusElement.textContent = ''; // Leave empty if no valid status
                    }

                    row.appendChild(statusElement);
                });

                attendanceTable.appendChild(row); // Add the row to the table
            }
        }
    });
}


function displayMonthlySummary() {
    // Retrieve saved attendance records from localStorage
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const loggedInAdmissionNumber = localStorage.getItem('admissionNumber'); // Get logged-in student's admission number

    if (attendanceRecords.length === 0) {
        alert("No attendance records found.");
        return;
    }

    // Clear previous data in the attendanceContainer
    const container = document.getElementById('attendanceContainer');
    container.innerHTML = ''; 

    // Filter the records by admission number
    const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);

    if (filteredRecords.length === 0) {
        alert("No attendance records found for this admission number.");
        return;
    }

    // Initialize overall totals for all months
    let overallTotalClasses = 0;
    let overallTotalPresent = 0;
    let overallTotalAbsent = 0;

    // Create a table for displaying monthly summaries
    const monthlyTable = document.createElement('table');
    monthlyTable.classList.add('attendance-summary-table'); // Add class for styling

    // Add table headers for monthly summary
    const monthlyHeaderRow = document.createElement('tr');
    monthlyHeaderRow.innerHTML = `
        <th>Month/Year</th>
        <th>Total Classes</th>
        <th>Present</th>
        <th>Absent</th>
        <th>Attendance Percentage</th>
    `;
    monthlyTable.appendChild(monthlyHeaderRow);

    // Loop through the filtered records and calculate the totals for each month
    filteredRecords.forEach(record => {
        let totalClasses = 0;
        let totalPresent = 0;
        let totalAbsent = 0;

        // Loop through each subject and each day to calculate totals
        record.subjects.forEach(subject => {
            subject.dailyAttendance.forEach(day => {
                const status = day.status.trim().toUpperCase();
                if (status === 'P' || status === 'A') {
                    totalClasses++; // Increment total classes
                    if (status === 'P') {
                        totalPresent++;
                    } else if (status === 'A') {
                        totalAbsent++;
                    }
                }
            });
        });

        // Add current month's totals to the overall totals
        overallTotalClasses += totalClasses;
        overallTotalPresent += totalPresent;
        overallTotalAbsent += totalAbsent;

        // Calculate percentage for the current month
        const attendancePercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : 0;

        // Add the row for the current month to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.month}/${record.year}</td>
            <td>${totalClasses}</td>
            <td>${totalPresent}</td>
            <td>${totalAbsent}</td>
            <td>${attendancePercentage}%</td>
        `;
        monthlyTable.appendChild(row);
    });

    // Add the monthly table to the attendance container
    container.appendChild(monthlyTable);

    // Calculate overall percentage
    const overallAttendancePercentage = overallTotalClasses > 0 ? ((overallTotalPresent / overallTotalClasses) * 100).toFixed(2) : 0;

    // Create a new table for overall summary
    const overallTable = document.createElement('table');
    overallTable.classList.add('overall-summary-table'); // Add class for styling

    // Add table headers for overall summary
    const overallHeaderRow = document.createElement('tr');
    overallHeaderRow.innerHTML = `
        <th>Total Classes</th>
        <th>Present</th>
        <th>Absent</th>
        <th>Overall Attendance Percentage</th>
    `;
    overallTable.appendChild(overallHeaderRow);

    // Add overall data as a row in the table
    const overallRow = document.createElement('tr');
    overallRow.innerHTML = `
        <td>${overallTotalClasses}</td>
        <td>${overallTotalPresent}</td>
        <td>${overallTotalAbsent}</td>
        <td>${overallAttendancePercentage}%</td>
    `;
    overallTable.appendChild(overallRow);

    // Add the overall summary table to the container
    container.appendChild(overallTable);
}




   // Fine link click event to show the fine content
   document.getElementById('dispatchLink').addEventListener('click', function (event) {
    event.preventDefault();
    showContent('dispatchFineContent');
});

// Send Message button click event to call the dispatchFine function
document.getElementById('dispatchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    dispatchFine(); // Call the separate function
});


// Separate function to handle fine dispatch based on attendance
function dispatchFine() {
    // Calculate overall attendance percentage
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const loggedInAdmissionNumber = localStorage.getItem('admissionNumber'); // Get logged-in student's admission number

    if (attendanceRecords.length === 0) {
        alert("No attendance records found.");
        return;
    }

    // Filter the records by admission number
    const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);

    if (filteredRecords.length === 0) {
        alert("No attendance records found for this admission number.");
        return;
    }

    let overallTotalClasses = 0;
    let overallTotalPresent = 0;

    // Calculate the overall attendance
    filteredRecords.forEach(record => {
        record.subjects.forEach(subject => {
            subject.dailyAttendance.forEach(day => {
                const status = day.status.trim().toUpperCase();
                if (status === 'P' || status === 'A') {
                    overallTotalClasses++; // Increment total classes
                    if (status === 'P') {
                        overallTotalPresent++;
                    }
                }
            });
        });
    });

    const overallAttendancePercentage = overallTotalClasses > 0 ? ((overallTotalPresent / overallTotalClasses) * 100).toFixed(2) : 0;

    // Check attendance and send appropriate message
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const messageField = document.getElementById('message');

    if (overallAttendancePercentage < 75) {
        messageField.value = `Dear parent, your ward has less than 75% attendance. Please pay the fine of Rs. 3000.`;
    } else {
        messageField.value = `Dear parent, your ward has ${overallAttendancePercentage}% attendance. No fine is required.`;
    }

    // Optionally, send the message here, e.g., send email or SMS via API
    alert('Message Sent: ' + messageField.value);
}


// Event listener for "Attendance Tracking" link
document.getElementById('attendenceTracking').addEventListener('click', function (event) {
    event.preventDefault();
    displayMonthlySummary(); // Show monthly summary (tracking mode)
    document.getElementById('attendanceContent').style.display = 'none'; // Hide daily attendance
    document.getElementById('attendanceContainer').style.display = 'block'; // Show the attendance tracking section
});

        // Function to get current date and time in desired format
        function updateDateTime() {
            const now = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
            const day = days[now.getDay()];
            const month = months[now.getMonth()];
            const date = now.getDate();
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
    
            return `${day}, ${month} ${date}, ${year} ${hours}:${minutes}:${seconds}`;
        }
    
        // Function to show date and time
        function showDateTime() {
            document.getElementById('dateTimeDisplay').textContent = updateDateTime();
        }
    
        
        // Update date and time every second
        setInterval(showDateTime, 1000);
    });