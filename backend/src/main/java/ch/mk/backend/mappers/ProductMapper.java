package ch.mk.backend.mappers;

import ch.mk.backend.dtos.ProductDto;
import ch.mk.backend.entities.Category;
import ch.mk.backend.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "categoryIds", expression = "java(mapCategoriesToIds(product.getCategories()))")
    ProductDto toDto(Product product);

    default List<Integer> mapCategoriesToIds(Set<Category> categories) {
        if (categories == null) {
            return null;
        }
        return categories.stream()
                .map(Category::getId)
                .collect(Collectors.toList());
    }
}
