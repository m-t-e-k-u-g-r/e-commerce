package ch.mk.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class ProductCategoryId implements Serializable {
    @Serial
    private static final long serialVersionUID = 3506570605994442406L;
    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;


}