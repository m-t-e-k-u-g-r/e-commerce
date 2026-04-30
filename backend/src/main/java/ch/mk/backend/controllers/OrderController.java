package ch.mk.backend.controllers;

import ch.mk.backend.dtos.*;
import ch.mk.backend.services.JWTService;
import ch.mk.backend.services.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
        OrderDto orderDto = orderService.createUserOrder(userId, addressId);

        return new ResponseEntity<>(orderDto, HttpStatus.CREATED);
    }

    @PostMapping("/guest")
    public ResponseEntity<GuestOrderCreatedDto> createGuestOrder(
            @RequestBody CreateGuestOrderDto dto
    ) {
        String token = UUID.randomUUID().toString();
        GuestOrderCreatedDto orderDto = orderService.createGuestOrder(dto, token);
        orderDto.setAccessToken(token);

        return new ResponseEntity<>(orderDto, HttpStatus.CREATED);
    }

    @GetMapping("/guest/{orderId}")
    public ResponseEntity<GuestOrderDto> getGuestOrder(
            @PathVariable Number orderId,
            @RequestParam String token
    ) {
        GuestOrderDto order = this.orderService.getGuestOrderById(orderId.intValue(), token);

        return new ResponseEntity<>(order, HttpStatus.OK);
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
