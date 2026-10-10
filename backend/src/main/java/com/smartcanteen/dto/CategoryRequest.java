package com.smartcanteen.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private String icon;
    private String description;
    private Integer displayOrder;
    private Boolean active;

    public CategoryRequest() {}

    public CategoryRequest(String name, String icon, String description, Integer displayOrder, Boolean active) {
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.displayOrder = displayOrder;
        this.active = active;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private String icon;
        private String description;
        private Integer displayOrder;
        private Boolean active;

        public Builder name(String name) { this.name = name; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }

        public CategoryRequest build() {
            return new CategoryRequest(name, icon, description, displayOrder, active);
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
