package com.example.demo.service;

import com.example.demo.flag.Flag;

import javax.persistence.*;
import java.util.List;

@Entity
public class Service {
    @Id
    private String id;
    private String label;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Flag> flags;

    public Service () {
        super();
    }

    public void update(Service updatedService) {
        this.label = updatedService.label;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Flag> getFlags() {
        return flags;
    }

    public void setFlags(List<Flag> flags) {
        this.flags = flags;
    }

    public void addFlag(Flag flag) {
        this.flags.add(flag);
    }

    @Override
    public String toString() {
        return "Service{" +
                "id='" + id + '\'' +
                ", label='" + label + '\'' +
                ", flags=" + flags +
                '}';
    }
}
