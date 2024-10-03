// Courses and subjects data
const courses = {
    BCA: [
        { id: '101', name: "Python" },
        { id: '102', name: "Data Structures" },
        { id: '103', name: "Java" }
    ],
    BCOM: [
        { id: '201', name: "Financial Accounting" },
        { id: '202', name: "Business Law" },
        { id: '203', name: "Marketing Management" }
    ],
    BBA: [
        { id: '301', name: "Organizational Behavior" },
        { id: '302', name: "Principles of Management" },
        { id: '303', name: "Business Strategy" }
    ],
    BSC: [
        { id: '401', name: "Physics" },
        { id: '402', name: "Chemistry" },
        { id: '403', name: "Electronics" }
    ],
    BTCCA: [
        { id: '501', name: "Networking" },
        { id: '502', name: "Software Engineering" },
        { id: '503', name: "Computer Architecture" }
    ],
    MPCS: [
        { id: '601', name: "Mathematics" },
        { id: '602', name: "Physics" },
        { id: '603', name: "Computer Science" }
    ],
    BTMBC: [
        { id: '701', name: "Microbiology" },
        { id: '702', name: "Biotechnology" },
        { id: '703', name: "Cell Biology" }
    ],
    MSTCS: [
        { id: '801', name: "Advanced Algorithms" },
        { id: '802', name: "Machine Learning" },
        { id: '803', name: "Cloud Computing" }
    ]
};


// Get references to elements
var adminLoginForm = document.getElementById('adminLoginForm');
var attendanceLoginForm = document.getElementById('attendanceLoginForm');
var adminDashboard = document.getElementById('adminDashboard');

// Toggle between Admin and Attendance Login
document.getElementById("adminLoginLink").addEventListener("click", function () {
    attendanceLoginForm.style.display = "none";
    adminLoginForm.style.display = "block";
});

document.getElementById("attendanceLoginLink").addEventListener("click", function () {
    adminLoginForm.style.display = "none";
    attendanceLoginForm.style.display = "block";
});

// Admin Login Form submission
document.getElementById("adminLogin").addEventListener("submit", function (event) {
    event.preventDefault();

    const adminUsername = document.getElementById("admin-username").value;
    const adminPassword = document.getElementById("admin-password").value;

    if (adminUsername === "admin" && adminPassword === "password@123") {
        adminLoginForm.style.display = "none";
        adminDashboard.style.display = "block";
    } else {
        alert("Invalid credentials.");
    }
});


// Show Student Details Button Click Event
document.getElementById("showStudentDetailsBtn").addEventListener("click", function () {
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("studentDetails").style.display = "block";

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById("studentTableBody");
            tableBody.innerHTML = '';

            data.forEach(student => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.admnNo}</td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.dob}</td>
                    <td>${student.semester}</td>
                    <td>${student.year}</td>
                    <td>${student.fathersName}</td>
                    <td>${student.fathersNumber}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching student data:', error));
});



// document.getElementById("showAttendanceBtn").addEventListener("click", function () {
//     document.getElementById("adminDashboard").style.display = "none";
//     document.getElementById("attendanceDetails").style.display = "block";

//     fetch('data.json')
//         .then(response => response.json())
//         .then(data => {
//             let tableBody = document.getElementById("getAttendance");
//             tableBody.innerHTML = '';

//             data.forEach(students => {
//                 let row = document.createElement("tr");
//                 row.innerHTML = `
//                 <td>${students.admnNo}</td>
//                 <td>${students.semester}</td>
//                 <td>${students.course}</td>
//                 <td>${students.name}</td>
//                 <td>${students.phone}</td>
//                 <td>${students.totalClasses}</td>
//                 <td>${students.totalPresent}</td>
//                 <td>${students.totalAbsent}</td>
//                 <td>${students.totalPercentage}</td>
//                 `;
//                 tableBody.appendChild(row);
//             });
//         })
//         .catch(error => console.error('Error fetching student data:', error));
// });



function calculateTotals(subjectId, presentId, absentId, totalClassesId, days) {
    const inputs = document.querySelectorAll(`#${subjectId} input`);
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalNoClass = 0;

    inputs.forEach(function (input) {
        const value = input.value.trim().toUpperCase(); // Convert input to uppercase
        if (value === 'P') {
            totalPresent++;
        } else if (value === 'A') {
            totalAbsent++;
        } else if (value === 'N') {
            totalNoClass++;
        }
    });

    const totalClasses = days - totalNoClass;
    document.getElementById(presentId).textContent = totalPresent;
    document.getElementById(absentId).textContent = totalAbsent;
    document.getElementById(totalClassesId).textContent = totalClasses;

    // Save totals to localStorage
    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const course = document.getElementById('courseSelect').value;
    const month = monthSelect.value.padStart(2, '0');
    const year = yearSelect.value;

    let savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    // Find or create the attendance record for the current student, course, month, and year
    let existingRecord = savedAttendanceRecords.find(record =>
        record.admissionNumber === admissionNumber &&
        record.course === course &&
        record.month === month &&
        record.year === year
    );

    if (!existingRecord) {
        existingRecord = {
            admissionNumber,
            course,
            month,
            year,
            subjects: [{}, {}, {}] // Initialize empty subjects
        };
        savedAttendanceRecords.push(existingRecord);
    }

    // Find the subject index (based on the subjectId)
    const subjectIndex = subjectId === 'subject1Classes' ? 0 : subjectId === 'subject2Classes' ? 1 : 2;

    // Save the totals for this subject
    existingRecord.subjects[subjectIndex].totals = {
        totalPresent,
        totalAbsent,
        totalClasses
    };

    localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendanceRecords));
}

const monthDays = {
    1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 
    10: 31, 11: 30, 12: 31
};

const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const subject1Classes = document.getElementById('subject1Classes');
const subject2Classes = document.getElementById('subject2Classes');
const subject3Classes = document.getElementById('subject3Classes');

// Function to generate input fields based on days in the month, with pre-population of data if available
function generateInputFields(subjectClasses, subjectId, presentId, absentId, totalClassesId, days, savedData = []) {
    subjectClasses.innerHTML = ''; // Clear existing input fields

    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const course = document.getElementById('courseSelect').value;
    const month = monthSelect.value.padStart(2, '0'); // Get the month (e.g., 09)
    const year = yearSelect.value; // Get the selected year

     for (let i = 1; i <= days; i++) {
            // Create the input if it doesn't exist yet
            input = document.createElement('input');
            input.type = 'text';
            input.id = `${subjectId}-day-${i}`; // Give each input a unique ID for the subject and day
            input.style.width = '15px';
            input.style.padding = '5px'; // Adjust input styling
            input.placeholder = i;
            input.maxLength = 1; // Limit input to a single character
            input.setAttribute('data-day', i); // Store the day in a data attribute

            // Append the input only if it doesn't exist
            subjectClasses.appendChild(input);

        // Pre-populate field if saved data exists for this day
        if (savedData[i - 1] && savedData[i - 1].status) {
            input.value = savedData[i - 1].status; // Ensure saved values are retained
        }

        // Add an event listener to save changes to localStorage when the user types
        input.addEventListener('input', function () {
            calculateTotals(subjectId, totalClassesId, presentId, absentId, days);
            
            // Save to localStorage immediately after input
            let savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

            // Find or create the attendance record for the current student, course, month, and year
            let existingRecord = savedAttendanceRecords.find(record => 
                record.admissionNumber === admissionNumber && 
                record.course === course && 
                record.month === month && 
                record.year === year
            );

            if (!existingRecord) {
                existingRecord = {
                    admissionNumber,
                    course,
                    month,
                    year,
                    subjects: [{}, {}, {}] // Initialize empty subjects
                };
                savedAttendanceRecords.push(existingRecord);
            }

            // Find the subject index (based on the subjectId)
            const subjectIndex = subjectId === 'subject1Classes' ? 0 : subjectId === 'subject2Classes' ? 1 : 2;

            // Ensure the subjects array exists and has a dailyAttendance array
            existingRecord.subjects[subjectIndex].dailyAttendance = existingRecord.subjects[subjectIndex].dailyAttendance || [];

            // Update the status for the specific day
            existingRecord.subjects[subjectIndex].dailyAttendance[i - 1] = {
                date: `${i.toString().padStart(2, '0')}/${month}/${year}`, // Format date as DD/MM/YYYY
                status: input.value.trim().toUpperCase() // Save attendance status (P, A, N)
            };

            // Save updated attendance records to localStorage
            localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendanceRecords));
        });

        subjectClasses.appendChild(input);
    }
}

function updateAttendanceFields() {
    const month = parseInt(monthSelect.value);
    let days = monthDays[month];
    const year = parseInt(yearSelect.value);
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        days = 29; // Leap year adjustment for February
    }

    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const course = document.getElementById('courseSelect').value;

    // Retrieve saved attendance data from localStorage
    const savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const existingRecord = savedAttendanceRecords.find(record =>
        record.admissionNumber === admissionNumber &&
        record.course === course &&
        record.month === month.toString().padStart(2, '0') &&
        record.year === year.toString()
    );

    if (existingRecord) {
        const subjects = existingRecord.subjects || [{}, {}, {}]; // Default subjects if no data exists

        // Apply totals for each subject
        if (subjects[0].totals) {
            document.getElementById('subject1TotalPresent').textContent = subjects[0].totals.totalPresent || 0;
            document.getElementById('subject1TotalAbsent').textContent = subjects[0].totals.totalAbsent || 0;
            document.getElementById('subject1TotalClasses').textContent = subjects[0].totals.totalClasses || days;
        }
        if (subjects[1].totals) {
            document.getElementById('subject2TotalPresent').textContent = subjects[1].totals.totalPresent || 0;
            document.getElementById('subject2TotalAbsent').textContent = subjects[1].totals.totalAbsent || 0;
            document.getElementById('subject2TotalClasses').textContent = subjects[1].totals.totalClasses || days;
        }
        if (subjects[2].totals) {
            document.getElementById('subject3TotalPresent').textContent = subjects[2].totals.totalPresent || 0;
            document.getElementById('subject3TotalAbsent').textContent = subjects[2].totals.totalAbsent || 0;
            document.getElementById('subject3TotalClasses').textContent = subjects[2].totals.totalClasses || days;
        }

        // Generate input fields for each subject with saved data if available
        generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', days, subjects[0].dailyAttendance || []);
        generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', days, subjects[1].dailyAttendance || []);
        generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', days, subjects[2].dailyAttendance || []);
    } else {
        // Clear the fields if no data exists
        generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', days);
        generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', days);
        generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', days);
    }
}

// Initialize attendance fields when the page loads
document.addEventListener('DOMContentLoaded', function () {
    updateAttendanceFields(); // Populate fields with saved data
});

// Event listeners for changes in the month or year dropdown
monthSelect.addEventListener('change', updateAttendanceFields);
yearSelect.addEventListener('change', updateAttendanceFields);


// Get the number of days in the selected month and year
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate(); // Get the last day of the month (0th day of next month)
}

// Handle month and year change
document.getElementById("monthSelect").addEventListener("change", function () {
    const selectedMonth = parseInt(this.value);
    const selectedYear = parseInt(document.getElementById("yearSelect").value);
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);


    generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass', daysInMonth);
    generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass', daysInMonth);
    generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass', daysInMonth);
});

document.getElementById("yearSelect").addEventListener("change", function () {
    const selectedMonth = parseInt(document.getElementById("monthSelect").value);
    const selectedYear = parseInt(this.value);
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);


    generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass', daysInMonth);
    generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass', daysInMonth);
    generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass', daysInMonth);
});

// Initialize input fields for the default selected month (January)
const initialMonth = parseInt(document.getElementById("monthSelect").value);
const initialYear = parseInt(document.getElementById("yearSelect").value);
const initialDaysInMonth = getDaysInMonth(initialMonth, initialYear);



//Auto fill attendace data
document.getElementById('admissionNoDisplay').addEventListener('input', function () {
    const admissionNumber = this.value.trim();

        updateAttendanceFields(); // Update fields with matching data when admission number changes


    if (!admissionNumber) return; // Skip further processing if admission number is empty

    fetch('data.json') // Fetch student data from json file
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === admissionNumber);
            const errorMessage = document.getElementById('errorMessage');
            if (student) {
                // Hide the error message if admission number is valid
                errorMessage.style.display = 'none';
                // Set semester and course
                document.getElementById('semesterDisplay').value = student.semester;
                const course = student.course.toUpperCase();
                document.getElementById('courseSelect').value = course;

                // Display subjects for the selected course
                displaySubjectsForCourse(course);
            } else {
                errorMessage.style.display = 'block';
                // Clear subjects if no student is found
                clearSubjects();
            }
        })
        .catch(error => console.error('Error fetching student data:', error));
});


// Corrected and updated displaySubjectsForCourse function
function displaySubjectsForCourse(course) {
    if (courses[course]) {
        courses[course].forEach((subject, index) => {
            const subjectNum = index + 1;
            // Update Subject ID in the table
            document.getElementById(`subject${subjectNum}Id`).textContent = subject.id;
            // Update Subject Name in the table
            document.getElementById(`subject${subjectNum}`).textContent = subject.name;
            // Also reset the class input fields for each subject
            const subjectClasses = document.getElementById(`subject${subjectNum}Classes`);
            const month = parseInt(monthSelect.value);
            const year = parseInt(yearSelect.value);
            const daysInMonth = getDaysInMonth(month, year);
            generateInputFields(subjectClasses, `subject${subjectNum}Classes`, `subject${subjectNum}TotalPresent`, `subject${subjectNum}TotalAbsent`, `subject${subjectNum}TotalClasses`, daysInMonth);
        });
    } else {
        clearSubjects();
    }
}


// Corrected clearSubjects function
function clearSubjects() {
    [1, 2, 3].forEach(num => {
        document.getElementById(`subject${num}Id`).textContent = num; // Reset to default numbers
        document.getElementById(`subject${num}`).textContent = `Subject ${num}`;
        document.getElementById(`subject${num}Classes`).innerHTML = '';
    });
}


// Handle changes in month and year
document.getElementById('monthSelect').addEventListener('change', updateAttendanceFields);
document.getElementById('yearSelect').addEventListener('change', updateAttendanceFields);

// Initial setup
updateAttendanceFields();


function clearSubjects() {
    [1, 2, 3].forEach(num => {
        document.getElementById(`subject${num}`).textContent = `Subject ${num}`;
        document.getElementById(`subject${num}Classes`).innerHTML = '';
    });
}


document.getElementById('saveAttendance').addEventListener('click', function () {
    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const semester = document.getElementById('semesterDisplay').value;
    const course = document.getElementById('courseSelect').value;
    const month = monthSelect.value.padStart(2, '0');
    const year = yearSelect.value;

    if (!admissionNumber || !semester || !course || !month || !year) {
        alert('Please make sure all fields are filled in.');
        return;
    }

    const attendanceRecord = {
        admissionNumber,
        semester,
        course,
        month,
        year,
        subjects: []
    };

    ['subject1', 'subject2', 'subject3'].forEach((subjectId, index) => {
        const courseSubjects = courses[course]; // Get the subjects for the selected course
        const subject = courseSubjects[index]; // Get the current subject from the course

        if (!subject || !subject.id) {
            console.error(`Subject ID missing for subject at index ${index}`);
        }

        const subjectName = subject.name;
        const subjectIdValue = subject.id;
        const totalPresent = document.getElementById(`${subjectId}TotalPresent`).textContent;
        const totalAbsent = document.getElementById(`${subjectId}TotalAbsent`).textContent;
        const totalClasses = document.getElementById(`${subjectId}TotalClasses`).textContent;

        const dailyAttendance = Array.from(document.querySelectorAll(`#${subjectId}Classes input`)).map((input, index) => {
            const day = (index + 1).toString().padStart(2, '0');
            return {
                date: `${day}/${month}/${year}`, // Format date as DD/MM/YYYY
                status: input.value.trim().toUpperCase() // Save attendance status (P, A, N)
            };
        });

        attendanceRecord.subjects.push({
            id: subjectIdValue, // Add the subject ID
            name: subjectName,
            totalPresent,
            totalAbsent,
            totalClasses,
            dailyAttendance
        });
    });

    let savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    const recordIndex = savedAttendanceRecords.findIndex(record => 
        record.admissionNumber === admissionNumber && 
        record.course === course && 
        record.month === month && 
        record.year === year

    );

    if (recordIndex >= 0) {
        savedAttendanceRecords[recordIndex] = attendanceRecord;
    } else {
        savedAttendanceRecords.push(attendanceRecord);
    }

    localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendanceRecords));

    alert('Attendance saved successfully!');
});


// Sample code to retrieve and view saved attendance (for reference)
function viewAttendance() {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    console.log(attendanceRecords);
}


//Login submission
document.getElementById('loginform').addEventListener('submit', function (event) {
    event.preventDefault();

    var adminNo = document.getElementById('admin-number').value;
    var dob = document.getElementById('dob').value;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === adminNo && student.dob === dob);

            if (student) {
                // Store student data in localStorage
                localStorage.setItem('admissionNumber', adminNo);
                localStorage.setItem('studentName', student.name);
                localStorage.setItem('studentDob', dob);
                localStorage.setItem('studentCourse', student.course);

                // Redirect to the dashboard or next page
                window.location.href = 'nav.html';
            } else {
                alert('Invalid admission number or date of birth');
            }
        })
        .catch(error => console.error('Error fetching student data:', error));
});




// // Optional: Go back or reset function to show the admin details again
// document.getElementById('goBack').addEventListener('click', function() {

//     // Hide attendance and student details
//     document.getElementById('adminDashboard').style.display = 'none';
//     document.getElementById('studentDetails').style.display = 'none';
// });



// Go Back button functionality
document.getElementById("goBack").addEventListener("click", function () {
    adminDashboard.style.display = "none";
    adminLoginForm.style.display = "block";
});

// Handle course selection
document.getElementById("courseSelect").addEventListener("change", function () {
    const selectedCourse = this.value;

    if (selectedCourse && courses[selectedCourse]) {
        document.getElementById("subject1").textContent = courses[selectedCourse][0];
        document.getElementById("subject2").textContent = courses[selectedCourse][1];
        document.getElementById("subject3").textContent = courses[selectedCourse][2];

        document.getElementById("subject1Classes").innerHTML = '';
        document.getElementById("subject2Classes").innerHTML = '';
        document.getElementById("subject3Classes").innerHTML = '';

        generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass');
        generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass');
        generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass');


    } else {
        clearSubjects();
    }
})