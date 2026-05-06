package ch.mk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    @Column(name = "type", nullable = false)
    private String type;

    @Lob
    @Column(name = "salutation", nullable = false)
    private String salutation;

    @Column(name = "forename", nullable = false)
    private String forename;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "house_number", nullable = false, length = 20)
    private String houseNumber;

    @Column(name = "zip_code", nullable = false, length = 20)
    private String zipCode;

    @Column(name = "city", nullable = false)
    private String city;

    @Lob
    @Column(name = "country")
    private String country;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}