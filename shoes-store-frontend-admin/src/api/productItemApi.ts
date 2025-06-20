import AdminAxiosClient from "./axiosClient";

const productItemApi = {
  getAllProductItems: (productId: any) => {
    return AdminAxiosClient.get(`/product/item/product/${productId}`);
  },

  getProductItemById: (id: any) => {
    return AdminAxiosClient.get(`/product/item/${id}`, {
      withCredentials: true,
    });
  },

  addNewProductItem: (productItemData: any) => {
    return AdminAxiosClient.post("/product/item", productItemData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProductItem: (id: any, productItemData: any) => {
    return AdminAxiosClient.put(`/product/item/${id}`, productItemData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteProductItem: (id: any) => {
    return AdminAxiosClient.delete(`/product/item/${id}`);
  },

  getRecentProducts: () => {
    return AdminAxiosClient.get("/product/item/recent", {
      withCredentials: true,
    });
  },

  getTopSaleProductItems: (page = 0, size = 9) => {
    return AdminAxiosClient.get("/product/item/top-sale", {
      params: { page, size },
    });
  },

  getNewProductItems: (page = 0, size = 9) => {
    return AdminAxiosClient.get("/product/item/new", {
      params: { page, size },
    });
  },

  getProductItemByColorAndSize: (productId: any, color: any, size: any) => {
    return AdminAxiosClient.get(`/product/items/get-by-color-and-size`, {
      params: {
        productId,
        color,
        size,
      },
    });
  },

  updateProductItemIsActive: (id: any, isActive: any) => {
    return AdminAxiosClient.put(`/product/item/${id}/is-active?isActive=${isActive}`)
  },
};

export default productItemApi;
