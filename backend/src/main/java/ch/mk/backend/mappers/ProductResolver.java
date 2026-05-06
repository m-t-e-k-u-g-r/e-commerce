package ch.mk.backend.mappers;

import ch.mk.backend.entities.Product;
import ch.mk.backend.repositories.ProductRepository;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class ProductResolver {

    private final ProductRepository productRepository;

    public ProductResolver(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Named("mapProduct")
    public Product map(Integer productId) {
        if (productId == null) return null;

        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
