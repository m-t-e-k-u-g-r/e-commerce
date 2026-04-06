package ch.mk.backend.services;

import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.entities.*;
import ch.mk.backend.mappers.OrderMapper;
import ch.mk.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderAddressRepository orderAddressRepository;
    private final AddressService addressService;

    public List<OrderDto> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    public OrderDto createOrder(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalPrice = cartItems.stream()
                .map(cartItem -> cartItem.getProduct().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = createOrderEntity(user, totalPrice);
        createOrderItems(order, cartItems);

        Address billingAddress = addressService.getBillingAddress(userId)
                .orElseThrow(() -> new RuntimeException("Billing address not found"));
        createOrderAddress(billingAddress, order);

        cartItemRepository.deleteAll(cartItems);

        return orderMapper.toDto(order);
    }

    public OrderDto updateOrderStatus(Integer orderId, Integer userId, String status) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    public void cancelOrder(Integer orderId, Integer userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    private Order createOrderEntity(User user, BigDecimal totalPrice) {
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
        return order;
    }

    private void createOrderAddress(Address billingAddress, Order order) {
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setOrder(order);
        orderAddress.setStreet(billingAddress.getStreet());
        orderAddress.setHouseNumber(billingAddress.getHouseNumber());
        orderAddress.setZipCode(billingAddress.getZipCode());
        orderAddress.setCity(billingAddress.getCity());
        orderAddress.setCountry(billingAddress.getCountry());
        orderAddressRepository.save(orderAddress);
    }

    private void createOrderItems(Order order, List<CartItem> cartItems) {
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }
    }
}
