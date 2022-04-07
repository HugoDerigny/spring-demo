package com.example.demo.flag;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Flag {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String key;
    private String value;
    private String description;
    private boolean enabled;

    public Flag() {
        super();
    }

    public Flag(String key, String value, String description, boolean enabled) {
        this.key = key;
        this.value = value;
        this.description = description;
        this.enabled = enabled;
    }

    public static Flag FromDto(FlagDto dto) {
        return new Flag(dto.key, dto.value, dto.description, dto.isEnabled);
    }

    public void update(Flag updatedFlag) {
        this.key = updatedFlag.key;
        this.value = updatedFlag.value;
        this.description = updatedFlag.description;
        this.enabled = updatedFlag.enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String toString() {
        return "Flag{" +
                "id=" + id +
                ", key='" + key + '\'' +
                ", value='" + value + '\'' +
                ", description='" + description + '\'' +
                ", enabled=" + enabled +
                '}';
    }
}
