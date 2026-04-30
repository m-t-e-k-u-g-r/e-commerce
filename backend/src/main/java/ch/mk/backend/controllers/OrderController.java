package ch.mk.backend.controllers;

import ch.mk.backend.dtos.*;
import ch.mk.backend.entities.User;
import ch.mk.backend.services.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> getOrders(
            @AuthenticationPrincipal User user
    ) {
        return orderService.getOrdersByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @AuthenticationPrincipal User user,
            @RequestBody CreateOrderDto dto
    ) {
        Integer addressId = dto.getAddressId();
        OrderDto orderDto = orderService.createUserOrder(user.getId(), addressId);

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
            @AuthenticationPrincipal User user,
            @PathVariable Number orderId,
            @RequestParam String status
    ) {
        OrderDto orderDto = orderService.updateOrderStatus(orderId.intValue(), user.getId(), status);
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Number orderId
    ) {
        orderService.cancelOrder(orderId.intValue(), user.getId());
        return ResponseEntity.noContent().build();
    }
}
