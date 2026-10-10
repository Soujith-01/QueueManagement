package com.smartcanteen.dto;

import com.smartcanteen.model.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String id;
    private String name;
    private String email;
    private Role role;
    private String universityId;
    private String department;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, String id, String name, String email, Role role, String universityId, String department) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.universityId = universityId;
        this.department = department;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private String id;
        private String name;
        private String email;
        private Role role;
        private String universityId;
        private String department;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder universityId(String universityId) { this.universityId = universityId; return this; }
        public Builder department(String department) { this.department = department; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, id, name, email, role, universityId, department);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getUniversityId() { return universityId; }
    public void setUniversityId(String universityId) { this.universityId = universityId; }
    @com.fasterxml.jackson.annotation.JsonProperty("studentId")
    public String getStudentId() { return universityId; }
    @com.fasterxml.jackson.annotation.JsonProperty("facultyId")
    public String getFacultyId() { return universityId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
