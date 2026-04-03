package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class ProductDto {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private List<Integer> categoryIds;
}
