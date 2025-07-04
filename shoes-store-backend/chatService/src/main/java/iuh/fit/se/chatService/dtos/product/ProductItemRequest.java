package iuh.fit.se.chatService.dtos.product;



import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductItemRequest {
    double price;
    List<String> images;
    String colorId;
    List<QuantityOfSize> quantityOfSize;
    String productId;
    Status status;
}
