package ch.mk.backend.mappers;

import ch.mk.backend.dtos.ProductDto;
import ch.mk.backend.entities.Category;
import ch.mk.backend.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(source = "categories", target = "categoryIds", qualifiedByName = "mapCategoriesToIds")
    ProductDto toDto(Product product);

    @Named("mapCategoriesToIds")
    default List<UUID> mapCategoriesToIds(Set<Category> categories) {
        if (categories == null) {
            return null;
        }
        return categories.stream()
                .map(Category::getId)
                .collect(Collectors.toList());
    }
}
