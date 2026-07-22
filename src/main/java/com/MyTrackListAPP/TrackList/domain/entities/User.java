package com.MyTrackListAPP.TrackList.domain.entities;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name="users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id",updatable = false,nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    private List<TaskList> taskLists;

    protected User() {}

    public User(UUID id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<TaskList> getTaskLists() {
        return taskLists;
    }

    public void setTaskLists(List<TaskList> taskLists) {
        this.taskLists = taskLists;
    }

    // ---  override UserDetails methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 暫無實作複雜角色權限，回傳空集合
        return Collections.emptyList();
    }

    @Override
    public String getUsername() {
        // 指定 Email 為 Spring Security 的登入帳號識別
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 帳號未過期
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 帳號未鎖定
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 密碼未過期
    }

    @Override
    public boolean isEnabled() {
        return true; // 帳號已啟用
    }

    // ----------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email) && Objects.equals(password, user.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, password);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                '}';
    }
}