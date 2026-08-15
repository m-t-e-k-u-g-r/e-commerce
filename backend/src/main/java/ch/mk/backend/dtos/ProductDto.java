package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Getter
public class ProductDto {
    private UUID id;
    private String name;
    private String description;
    private Double price;
    private String imageId;
    private List<UUID> categoryIds;
}
