import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class FileManager {
    private final Path filePath;

    public FileManager(String fileName) {
        this.filePath = Paths.get(fileName);
    }

    public void writeStudentsToFile(List<Student> students) {
        try {
            Path parent = filePath.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }

            List<String> lines = new ArrayList<>();
            for (Student student : students) {
                lines.add(student.getName() + "|" + student.getRollNumber() + "|" + student.getGrade() + "|"
                        + student.getDepartment() + "|" + student.getEmail() + "|" + student.getPhoneNumber());
            }

            Files.write(filePath, lines, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            System.out.println("Records saved to " + filePath.toAbsolutePath());
        } catch (IOException exception) {
            System.out.println("Unable to save student records: " + exception.getMessage());
        }
    }

    public List<Student> readStudentsFromFile() {
        List<Student> students = new ArrayList<>();

        if (!Files.exists(filePath)) {
            return students;
        }

        try {
            List<String> lines = Files.readAllLines(filePath);
            for (String line : lines) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] parts = line.split("\\|", -1);
                if (parts.length == 6) {
                    Student student = new Student(
                            parts[0],
                            Integer.parseInt(parts[1]),
                            parts[2],
                            parts[3],
                            parts[4],
                            parts[5]
                    );
                    students.add(student);
                }
            }
        } catch (IOException exception) {
            System.out.println("Unable to read student records: " + exception.getMessage());
        }

        return students;
    }
}
