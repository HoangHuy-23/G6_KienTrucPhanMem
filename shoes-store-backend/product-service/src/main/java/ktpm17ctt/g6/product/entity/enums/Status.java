package ktpm17ctt.g6.product.entity.enums;

public enum Status {
    INSTOCK("In stock"),
    OUTOFSTOCK("Out of stock");

    private final String status;

    Status(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
