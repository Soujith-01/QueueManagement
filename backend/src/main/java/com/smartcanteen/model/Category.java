package com.smartcanteen.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String slug;

    private String icon;

    private String description;

    private int displayOrder = 0;

    private boolean active = true;

    public Category() {}

    public Category(String id, String name, String slug, String icon, String description, int displayOrder, boolean active) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.icon = icon;
        this.description = description;
        this.displayOrder = displayOrder;
        this.active = active;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String slug;
        private String icon;
        private String description;
        private int displayOrder = 0;
        private boolean active = true;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder displayOrder(int displayOrder) { this.displayOrder = displayOrder; return this; }
        public Builder active(boolean active) { this.active = active; return this; }

        public Category build() {
            return new Category(id, name, slug, icon, description, displayOrder, active);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
