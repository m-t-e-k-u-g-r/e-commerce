package ch.mk.backend.services;

import ch.mk.backend.dtos.*;
import ch.mk.backend.entities.*;
import ch.mk.backend.mappers.AddressMapper;
import ch.mk.backend.mappers.CartItemMapper;
import ch.mk.backend.mappers.OrderMapper;
import ch.mk.backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Consumer;

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
    private final GuestService guestService;
    private final CartItemMapper cartItemMapper;
    private final AddressMapper addressMapper;
    private final GuestRepository guestRepository;
    private final BCryptPasswordEncoder bcryptEncoder;

    public List<OrderDto> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    public GuestOrderDto getGuestOrderById(Integer orderId, String accessToken) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND"));

        boolean valid = bcryptEncoder.matches(accessToken, order.getAccessTokenHash());
        if (!valid) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "INVALID_ACCESS_TOKEN");

        return orderMapper.getGuestOrderDto(order);
    }

    @Transactional
    public OrderDto createUserOrder(Integer userId, Integer addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CART_EMPTY");
        }

        CreateAddressDto shippingAddress = addressMapper.toCreateDto(
                addressService.getAddressByIdAndUserId(addressId, userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ADDRESS_NOT_FOUND"))
        );

        cartItemRepository.deleteAll(cartItems);
        return processOrder(cartItems, shippingAddress, order -> order.setUser(user));
    }

    @Transactional
    public GuestOrderCreatedDto createGuestOrder(CreateGuestOrderDto dto, String accessToken) {
        Guest guest = guestService.createGuest(dto.getEmail());
        List<CartItem> cartItems = dto.getItems().stream()
                .map(cartItemMapper::toEntity)
                .toList();

        guestRepository.save(guest);
        String tokenHash = bcryptEncoder.encode(accessToken);
        OrderDto orderDto = processOrder(cartItems, dto.getAddress(),
                order -> {
                    order.setGuest(guest);
                    order.setAccessTokenHash(tokenHash);
                }
        );
        return orderMapper.toGuestOrderDto(orderDto, guest.getId(), accessToken);
    }

    private OrderDto processOrder(
            List<CartItem> cartItems,
            CreateAddressDto shippingAddress,
            Consumer<Order> customerSetter
    ) {
        BigDecimal totalPrice = calculateTotalPrice(cartItems);
        Order order = createOrderEntity(totalPrice);

        List<OrderItem> orderItems = createOrderItems(order, cartItems);
        order.setItems(orderItems);
        OrderAddress orderAddress = createOrderAddress(shippingAddress, order);
        order.setAddress(orderAddress);
        orderAddress.setOrder(order);

        customerSetter.accept(order);

        orderRepository.save(order);
        orderAddressRepository.save(orderAddress);
        orderItemRepository.saveAll(orderItems);
        return orderMapper.toDto(order);
    }

    private BigDecimal calculateTotalPrice(List<CartItem> cartItems) {
        return cartItems.stream()
                .filter(item -> item.getProduct() != null)
                .map(item -> item.getProduct()
                        .getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public OrderDto updateOrderStatus(Integer orderId, Integer userId, String status) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND"));
        order.setStatus(status);
        orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    public void cancelOrder(Integer orderId, Integer userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND"));
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    private Order createOrderEntity(BigDecimal totalPrice) {
        Order order = new Order();
        order.setStatus("PENDING");
        order.setTotalPrice(totalPrice);
        return order;
    }

    private OrderAddress createOrderAddress(CreateAddressDto billingAddress, Order order) {
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setOrder(order);
        orderAddress.setStreet(billingAddress.getStreet());
        orderAddress.setHouseNumber(billingAddress.getHouseNumber());
        orderAddress.setZipCode(billingAddress.getZipCode());
        orderAddress.setCity(billingAddress.getCity());
        orderAddress.setCountry(billingAddress.getCountry());
        return orderAddress;
    }

    private List<OrderItem> createOrderItems(Order order, List<CartItem> cartItems) {
        List<OrderItem> orderItems = new java.util.ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItems.add(orderItem);
        }
        return orderItems;
    }
}
