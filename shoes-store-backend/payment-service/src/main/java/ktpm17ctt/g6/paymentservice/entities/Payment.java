package ktpm17ctt.g6.paymentservice.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String transactionId;
    private String transactionDate;
    private String transactionType;
    private String userId;
    private String orderId;
    private long amount;
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}
