package ch.mk.backend.mappers;

import ch.mk.backend.dtos.ProductDto;
import ch.mk.backend.entities.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDto toDto(Product product);
}
