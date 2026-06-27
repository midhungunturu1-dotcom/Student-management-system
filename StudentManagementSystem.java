import java.util.ArrayList;
import java.util.List;

public class StudentManagementSystem {
    private final ArrayList<Student> students;
    private final FileManager fileManager;

    public StudentManagementSystem(String fileName) {
        this.students = new ArrayList<>();
        this.fileManager = new FileManager(fileName);
    }

    public boolean addStudent(Student student) {
        if (student == null || searchStudent(student.getRollNumber()) != null) {
            return false;
        }
        students.add(student);
        return true;
    }

    public boolean removeStudent(int rollNumber) {
        Student student = searchStudent(rollNumber);
        if (student == null) {
            return false;
        }
        students.remove(student);
        return true;
    }

    public boolean updateStudent(Student student) {
        if (student == null) {
            return false;
        }

        for (int index = 0; index < students.size(); index++) {
            Student current = students.get(index);
            if (current.getRollNumber() == student.getRollNumber()) {
                students.set(index, student);
                return true;
            }
        }
        return false;
    }

    public Student searchStudent(int rollNumber) {
        for (Student student : students) {
            if (student.getRollNumber() == rollNumber) {
                return student;
            }
        }
        return null;
    }

    public void displayStudents() {
        if (students.isEmpty()) {
            System.out.println("No students available.");
            return;
        }

        for (Student student : students) {
            System.out.println(student);
        }
    }

    public void saveStudents() {
        fileManager.writeStudentsToFile(students);
    }

    public void loadStudents() {
        List<Student> loadedStudents = fileManager.readStudentsFromFile();
        students.clear();
        students.addAll(loadedStudents);
    }

    public int getStudentCount() {
        return students.size();
    }

    public List<Student> getAllStudents() {
        return new ArrayList<>(students);
    }
}
