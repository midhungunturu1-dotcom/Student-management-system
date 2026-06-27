# Student Management System

## Project Overview
This project is a complete Student Management System built with HTML, CSS, JavaScript, and Java. The website provides a modern, responsive dashboard for managing student records, while the Java components model the data using object-oriented programming principles and save records to a text file.

## Features
- Responsive dashboard with glassmorphism styling
- Add, update, delete, search, sort, and filter student records
- Validation for name, roll number, grade, department, email, and phone number
- Export and import student data as CSV
- Print student list
- Dark and light mode toggle
- Browser-based local storage support for a smooth demo experience
- Java backend with file-based persistence using students.txt

## Folder Structure
- index.html: Main page structure
- style.css: Premium responsive styling and theme support
- script.js: Dashboard interactivity, validation, and local data management
- Student.java: Student model class
- StudentManagementSystem.java: Core OOP student management logic
- FileManager.java: Reading and writing student records from students.txt
- Main.java: Console-based Java demo entry point
- students.txt: Persistent student data file
- README.md: Project documentation

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Java (JDK)

## How to Run in VS Code
1. Open the project folder in VS Code.
2. Open index.html in a browser to use the website.
3. To run the Java console demo, open the integrated terminal and run:
   `javac *.java`
   `java Main`

## Screenshots
Open the dashboard in your browser to view the polished student management interface. You can capture screenshots after launching the page for presentations or documentation.

## Future Enhancements
- Connect the web interface to a real Java backend service
- Add authentication for administrators
- Support pagination for large student lists
- Add charts for grade and department analytics
