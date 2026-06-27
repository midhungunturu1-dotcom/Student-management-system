import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        StudentManagementSystem system = new StudentManagementSystem("students.txt");
        system.loadStudents();

        System.out.println("=== Student Management System ===");
        System.out.println("Loaded " + system.getStudentCount() + " records from students.txt");

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println();
            System.out.println("1. Add student");
            System.out.println("2. Search student");
            System.out.println("3. Display all students");
            System.out.println("4. Save records");
            System.out.println("5. Exit");
            System.out.print("Choose an option: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    Student student = readStudent(scanner);
                    if (system.addStudent(student)) {
                        System.out.println("Student added successfully.");
                    } else {
                        System.out.println("Unable to add student. Roll number may already exist.");
                    }
                    break;
                case "2":
                    System.out.print("Enter roll number: ");
                    int roll = Integer.parseInt(scanner.nextLine());
                    Student found = system.searchStudent(roll);
                    if (found != null) {
                        System.out.println(found);
                    } else {
                        System.out.println("Student not found.");
                    }
                    break;
                case "3":
                    system.displayStudents();
                    break;
                case "4":
                    system.saveStudents();
                    break;
                case "5":
                    running = false;
                    break;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }

        scanner.close();
        System.out.println("Thank you for using Student Management System.");
    }

    private static Student readStudent(Scanner scanner) {
        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Roll Number: ");
        int roll = Integer.parseInt(scanner.nextLine());
        System.out.print("Grade: ");
        String grade = scanner.nextLine();
        System.out.print("Department: ");
        String department = scanner.nextLine();
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Phone: ");
        String phone = scanner.nextLine();

        return new Student(name, roll, grade, department, email, phone);
    }
}
