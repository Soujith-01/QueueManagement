package com.smartcanteen.dto;

import com.smartcanteen.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    private String universityId;
    private String department;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String phone, Role role, String universityId, String department) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.universityId = universityId;
        this.department = department;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String email;
        private String password;
        private String phone;
        private Role role;
        private String universityId;
        private String department;

        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder universityId(String universityId) { this.universityId = universityId; return this; }
        public Builder department(String department) { this.department = department; return this; }

        public RegisterRequest build() {
            return new RegisterRequest(name, email, password, phone, role, universityId, department);
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getUniversityId() { return universityId; }
    public void setUniversityId(String universityId) { this.universityId = universityId; }
    public String getStudentId() { return universityId; }
    public void setStudentId(String studentId) { if (studentId != null && !studentId.isBlank()) this.universityId = studentId; }
    public String getFacultyId() { return universityId; }
    public void setFacultyId(String facultyId) { if (facultyId != null && !facultyId.isBlank()) this.universityId = facultyId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
