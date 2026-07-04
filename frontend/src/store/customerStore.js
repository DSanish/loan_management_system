import { create } from "zustand";
import customerService from "../services/customerService";

const useCustomerStore = create((set, get) => ({

  // ==========================
  // State
  // ==========================

  customers: [],
  selectedCustomer: null,

  loading: false,
  error: null,

  total: 0,
  page: 1,
  pageSize: 20,
  pages: 1,

  search: "",

  // ==========================
  // Get Customers
  // ==========================

  fetchCustomers: async (params = {}) => {

    try {

      set({
        loading: true,
        error: null,
      });

      const data = await customerService.getCustomers({
        page: get().page,
        page_size: get().pageSize,
        q: get().search,
        ...params,
      });

      set({
        customers: data.items || [],
        total: data.total || 0,
        pages: data.pages || 1,
        page: data.page || 1,
        pageSize: data.page_size || 20,
        loading: false,
      });

    } catch (error) {

      set({
        loading: false,
        error: error.message || "Unable to load customers",
      });

    }

  },

  // ==========================
  // Get Single Customer
  // ==========================

  fetchCustomer: async (id) => {

    try {

      set({
        loading: true,
      });

      const customer = await customerService.getCustomerById(id);

      set({
        selectedCustomer: customer,
        loading: false,
      });

    } catch (error) {

      set({
        loading: false,
        error: error.message,
      });

    }

  },

  // ==========================
  // Create Customer
  // ==========================

  createCustomer: async (customerData) => {

    await customerService.createCustomer(customerData);

    await get().fetchCustomers();

  },

  // ==========================
  // Update Customer
  // ==========================

  updateCustomer: async (id, customerData) => {

    await customerService.updateCustomer(
      id,
      customerData
    );

    await get().fetchCustomers();

  },

  // ==========================
  // Delete Customer
  // ==========================

  deleteCustomer: async (id) => {

    await customerService.deleteCustomer(id);

    await get().fetchCustomers();

  },

  // ==========================
  // Search
  // ==========================

  setSearch: (value) => {

    set({
      search: value,
    });

  },

  // ==========================
  // Pagination
  // ==========================

  setPage: (page) => {

    set({
      page,
    });

  },

  // ==========================
  // Clear Error
  // ==========================

  clearError: () => {

    set({
      error: null,
    });

  },

}));

export default useCustomerStore;