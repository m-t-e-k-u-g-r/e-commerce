package ch.mk.backend.controllers;


import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/images")
@AllArgsConstructor
public class ImageController {

    @GetMapping("/products/{image_id}")
    public ResponseEntity<Resource> getImageById(@PathVariable String image_id) {
        Resource resource = new ClassPathResource("uploads/products/webp/product_" + image_id + ".webp");

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/webp"))
                .body(resource);
    }
}
