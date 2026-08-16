package ch.mk.backend.controllers;

import ch.mk.backend.dtos.ProductDto;
import ch.mk.backend.mappers.ProductMapper;
import ch.mk.backend.repositories.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {
    private final ProductMapper productMapper;
    private final ProductRepository productRepository;

    @GetMapping
    public List<ProductDto> findAllProducts(
            @RequestParam(required = false) String sort
    ) {
        if (sort == null || !Set.of("name", "price", "id").contains(sort)) {
            sort = "id";
        }

        return productRepository.findAll(Sort.by(sort))
                .stream()
                .map(productMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> findProductById(@PathVariable UUID id) {
        return productRepository.findById(id)
                .map(productMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
