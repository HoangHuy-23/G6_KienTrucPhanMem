package ktpm17ctt.g6.product.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ColorRequest {
    @Size(min = 1, max = 50, message = "COLOR_NAME_INVALID")
    String name;
    @Size(min = 1, max = 7, message = "COLOR_CODE_INVALID")
    String code;
}
