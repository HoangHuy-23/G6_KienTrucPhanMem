package ktpm17ctt.g6.orderservice.services;

import jakarta.servlet.http.HttpServletRequest;
import ktpm17ctt.g6.orderservice.dto.request.OrderCreationRequest;
import ktpm17ctt.g6.orderservice.dto.response.OrderResponse;

public interface OrderService {
    OrderResponse save(OrderCreationRequest request, HttpServletRequest httpServletRequest) throws Exception;

    OrderResponse findById(String s) throws Exception;
}
