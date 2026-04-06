package ch.mk.backend.controllers;

import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.dtos.CreateOrderDto;
import ch.mk.backend.services.JWTService;
import ch.mk.backend.services.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {

    private final JWTService jwtService;
    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> getOrders(
            @CookieValue("accessToken") String accessToken
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);

        return orderService.getOrdersByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @CookieValue("accessToken") String accessToken,
            @RequestBody CreateOrderDto dto
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        Integer addressId = dto.getAddressId();
        OrderDto orderDto = orderService.createOrder(userId, addressId);

        return new ResponseEntity<>(orderDto, HttpStatus.CREATED);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @CookieValue("accessToken") String accessToken,
            @PathVariable Number orderId,
            @RequestParam String status
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        OrderDto orderDto = orderService.updateOrderStatus(orderId.intValue(), userId, status);
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(
            @CookieValue("accessToken") String accessToken,
            @PathVariable Number orderId
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        orderService.cancelOrder(orderId.intValue(), userId);
        return ResponseEntity.noContent().build();
    }
}
